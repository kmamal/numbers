const P_INFINITY = Symbol("Infinity (Integer)")
const N_INFINITY = Symbol("-Infinity (Integer)")
const NAN = Symbol("NaN (Integer)")

const _isMember = (x) => typeof x === 'bigint'
const isMember = (x) => ec.isMember(x) ?? _isMember(x)

const _sign = (x) => x > 0n ? 1n : x < 0n ? -1n : 0n
const sign = (x) => ec.sign(x) ?? _sign(x)

const _neg = (x) => -x
const neg = (x) => ec.neg(x) ?? _neg(x)

const _abs = (x) => x < 0n ? -x : x
const abs = (x) => ec.abs(x) ?? _abs(x)

const _add = (a, b) => a + b
const add = (a, b) => ec.add(a, b) ?? _add(a, b)

const _sub = (a, b) => a - b
const sub = (a, b) => ec.sub(a, b) ?? _sub(a, b)

const _mul = (a, b) => a * b
const mul = (a, b) => ec.mul(a, b) ?? _mul(a, b)

const _div = (a, b) => a / b
const div = (a, b) => ec.div(a, b) ?? _div(a, b)

const _mod = (a, b) => a % b
const mod = (a, b) => ec.mod(a, b) ?? _mod(a, b)

const _pow = (a, b) => a ** b
const pow = (a, b) => ec.pow(a, b) ?? _pow(a, b)

const _square = (x) => _mul(x, x)
const square = (x) => mul(x, x)

const _eq = (a, b) => a === b
const eq = (a, b) => ec.eq(a, b) ?? _eq(a, b)

const _neq = (a, b) => a !== b
const neq = (a, b) => !eq(a, b)

const _lt = (a, b) => a < b
const lt = (a, b) => ec.lt(a, b) ?? _lt(a, b)

const _gt = (a, b) => a > b
const gt = (a, b) => lt(b, a)

const _lte = (a, b) => a <= b
const lte = (a, b) => ec.lte(a, b) ?? _lte(a, b)

const _gte = (a, b) => a >= b
const gte = (a, b) => lte(b, a)

const _min = (a, b) => a <= b ? a : b
const min = (a, b) => ec.min(a, b) ?? _min(a, b)

const _max = (a, b) => a <= b ? a : b
const max = (a, b) => ec.min(a, b) ?? _max(a, b)

const _fromString = (s) => BigInt(s)
const fromString = (s) => ec.fromString(s) ?? _fromString(s)

const _toString = (x) => x.toString()
const toString = (x) => ec.toString(x) ?? _toString(x)

const _fromNumber = (n) => BigInt(n)
const fromNumber = (n) => ec.fromNumber(n) ?? _fromNumber(n)

const _toNumber = (x) => Number(x)
const toNumber = (x) => ec.toNumber(x) ?? _toNumber(x)

const from = (x) => {
	if (isMember(x)) { return x }
	if (typeof x === 'number') { return fromNumber(x) }
	if (typeof x === 'string') { return fromString(x) }
	return NAN
}


const Algebra = {
	...{ PInfinity: P_INFINITY, NInfinity: N_INFINITY, NaN: NAN },
	...{ _isMember, isMember },
	...{ _sign, _abs, _neg, _add, _sub, _mul, _div, _mod, _pow, _square },
	...{ sign, abs, neg, add, sub, mul, div, mod, pow, square },
	...{ _eq, _neq, _lt, _gt, _lte, _gte, _min, _max },
	...{ eq, neq, lt, gt, lte, gte, min, max },
	...{ _fromNumber, _toNumber },
	...{ fromNumber, toNumber },
	...{ _fromString, _toString },
	...{ fromString, toString },
	...{ from },
}

const ec = require('../edge-cases').defineFor(Algebra)

module.exports = {
	__info: {
		name: 'integer',
		isPrimitive: true,
	},
	...Algebra,
	isFinite: ec.isFinite,
	isNaN: ec.isNaN,
	edgeCases: ec,
}
