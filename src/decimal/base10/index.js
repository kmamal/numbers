const I = require('../integer')

const P_INFINITY = Symbol("Infinity (Decimal)")
const N_INFINITY = Symbol("-Infinity (Decimal)")
const NAN = Symbol("NaN (Decimal)")

const ONE = { man: 1n, str: '1', exp: 0n }

const _copy = (dst, src) => {
	dst.man = src.man
	dst.str = src.str
	dst.exp = src.exp
}
const _clone = (x) => ({
	man: x.man,
	str: x.str,
	exp: x.exp,
})

const _isMember = (x) => true
	&& x
	&& typeof x === 'object'
	&& I.isMember(x.man)
	&& typeof x.str === 'string'
	&& I.isMember(x.exp)
const isMember = (x) => ec.isMember(x) ?? _isMember(x)

const _signTo = (dst, x) => {
	const man = I._sign(x.man)
	dst.man = man
	if (man === 0n) {
		dst.str = '0'
		dst.exp = 0n
	} else {
		dst.str = '1'
		dst.exp = 0n
	}
}
const _sign = (x) => {
	const res = {}
	_signTo(res, x)
	return res
}
const sign = (x) => ec.sign(x) ?? _sign(x)

const _absTo = (dst, x) => {
	dst.man = I._abs(x.man)
	dst.str = x.str
	dst.exp = x.exp
}
const _abs = (x) => {
	const res = {}
	_absTo(res, x)
	return res
}
const abs = (x) => ec.abs(x) ?? _abs(x)

const _negTo = (dst, x) => {
	dst.man = -x.man
	dst.str = x.str
	dst.exp = x.exp
}
const _neg = (x) => {
	const res = {}
	_negTo(res, x)
	return res
}
const neg = (x) => ec.neg(x) ?? _neg(x)

const _addTo = (dst, a, b) => {
	let man
	let exp
	const diff = a.exp - b.exp
	if (diff > 0n) {
		man = a.man * 10n ** diff + b.man
		exp = b.exp
	} else if (diff < 0n) {
		man = a.man + b.man * 10n ** -diff
		exp = a.exp
	} else {
		man = a.man + b.man
		exp = a.exp
	}
	_fromScientificTo(dst, man, exp)
}
const _add = (a, b) => {
	const res = {}
	_addTo(res, a, b)
	return res
}
const add = (a, b) => ec.add(a, b) ?? _add(a, b)

const _subTo = (dst, a, b) => {
	let man
	let exp
	const diff = a.exp - b.exp
	if (diff > 0n) {
		man = a.man * 10n ** diff - b.man
		exp = b.exp
	} else if (diff < 0n) {
		man = a.man - b.man * 10n ** -diff
		exp = a.exp
	} else {
		man = a.man - b.man
		exp = a.exp
	}
	_fromScientificTo(dst, man, exp)
}
const _sub = (a, b) => {
	const res = {}
	_subTo(res, a, b)
	return res
}
const sub = (a, b) => ec.sub(a, b) ?? _sub(a, b)

const _mulTo = (dst, a, b) => {
	const man = a.man * b.man
	const exp = a.exp + b.exp
	_fromScientificTo(dst, man, exp)
}
const _mul = (a, b) => {
	const res = {}
	_mulTo(res, a, b)
	return res
}
const mul = (a, b) => ec.mul(a, b) ?? _mul(a, b)

const _divTo = (dst, a, b) => {
	const man = a.man / b.man
	const exp = a.exp - b.exp
	_fromScientificTo(dst, man, exp)
}
const _div = (a, b) => {
	const res = {}
	_divTo(res, a, b)
	return res
}
const div = (a, b) => ec.div(a, b) ?? _div(a, b)

const _modTo = (dst, a, b) => {
	const q = _floor(_abs(_div(a, b))) /// could be better
	_subTo(dst, a, _mul(a, q))
}
const _mod = (a, b) => {
	const res = {}
	_modTo(res, a, b)
	return res
}
const mod = (a, b) => ec.mod(a, b) ?? _mod(a, b)

const _inverseTo = (dst, x) => _divTo(dst, ONE, x)
const _inverse = (x) => {
	const res = {}
	_inverseTo(res, x)
	return res
}
const inverse = (x) => ec.inverse(x) ?? _inverse(x)

const _squareTo = (dst, x) => _mulTo(dst, x, x)
const _square = (x) => {
	const res = {}
	_squareTo(res, x)
	return res
}
const square = (x) => mul(x, x)

const _floorTo = (dst, x) => {
	if (x.exp >= 0n) {
		_copy(dst, x)
		return
	}

	let whole = _toInteger(x)
	if (x.man < 0n) { whole-- }
	_fromIntegerTo(dst, whole)
}
const _floor = (x) => {
	const res = {}
	_floorTo(res, x)
	return res
}
const floor = (x) => ec.floor(x) ?? _floor(x)

const _ceilTo = (dst, x) => {
	if (x.exp >= 0n) {
		_copy(dst, x)
		return
	}

	let whole = _toInteger(x)
	if (x.man > 0n) { whole++ }
	_fromIntegerTo(dst, whole)
}
const _ceil = (x) => {
	const res = {}
	_ceilTo(res, x)
	return res
}
const ceil = (x) => ec.ceil(x) ?? _ceil(x)

const _roundTo = (dst, x) => {
	if (x.exp >= 0n) {
		_copy(dst, x)
		return
	}

	const doubleWhole = x.exp > -x.str.length
		? (2n * x.man) / 10n ** -x.exp
		: 0n
	_fromIntegerTo(dst, (doubleWhole + 1n) / 2n)
}
const _round = (x) => {
	const res = {}
	_roundTo(res, x)
	return res
}
const round = (x) => ec.round(x) ?? _round(x)

const _intTo = (dst, x) => {
	const whole = _toInteger(x)
	_fromIntegerTo(dst, whole)
}
const _int = (x) => {
	const res = {}
	_intTo(res, x)
	return res
}
const int = (x) => ec.int(x) ?? _int(x)

const _fracTo = (dst, x) => {
	if (x.exp >= 0) {
		dst.man = 0
		dst.str = '0'
		dst.exp = 0n
		return
	}

	if (x.exp <= -x.str.length) {
		_copy(dst, x)
		return
	}

	const rest = x.man % (10n ** -x.exp)
	_fromScientificTo(dst, rest, x.exp)
}
const _frac = (x) => {
	const res = {}
	_fracTo(res, x)
	return res
}
const frac = (x) => ec.frac(x) ?? _frac(x)

const _eq = (a, b) => true
  && a.man === b.man
	&& a.exp === b.exp
const eq = (a, b) => ec.eq(a, b) ?? _eq(a, b)

const _neq = (a, b) => false
	|| a.man !== b.man
	|| a.exp !== b.exp
const neq = (a, b) => !eq(a, b)

const _lt = (a, b) => {
	if (a.man < 0n && b.man >= 0n) { return true }
	if (a.man >= 0n && b.man < 0n) { return false }
	const aScale = a.exp - a.str.length
	const bScale = b.exp - b.str.length
	if (aScale < bScale) { return true }
	if (aScale > bScale) { return false }
	return a.man < b.man
}
const lt = (a, b) => ec.lt(a, b) ?? _lt(a, b)

const _gt = (a, b) => {
	if (a.man >= 0n && b.man < 0n) { return true }
	if (a.man < 0n && b.man >= 0n) { return false }
	const aScale = a.exp - a.str.length
	const bScale = b.exp - b.str.length
	if (aScale > bScale) { return true }
	if (aScale < bScale) { return false }
	return a.man > b.man
}
const gt = (a, b) => lt(b, a)

const _lte = (a, b) => {
	if (a.man < 0n && b.man >= 0n) { return true }
	if (a.man >= 0n && b.man < 0n) { return false }
	const aScale = a.exp - a.str.length
	const bScale = b.exp - b.str.length
	if (aScale < bScale) { return true }
	if (aScale > bScale) { return false }
	return a.man <= b.man
}
const lte = (a, b) => ec.lte(a, b) ?? _lte(a, b)

const _gte = (a, b) => {
	if (a.man >= 0n && b.man < 0n) { return true }
	if (a.man < 0n && b.man >= 0n) { return false }
	const aScale = a.exp - a.str.length
	const bScale = b.exp - b.str.length
	if (aScale > bScale) { return true }
	if (aScale < bScale) { return false }
	return a.man >= b.man
}
const gte = (a, b) => lte(b, a)

const _minTo = (dst, a, b) => {
	const m = lte(a, b) ? a : b
	dst.man = m.man
	dst.str = m.str
	dst.exp = m.exp
}
const _min = (a, b) => {
	const res = {}
	_minTo(res, a, b)
	return res
}
const min = (a, b) => ec.min(a, b) ?? _min(a, b)

const _maxTo = (dst, a, b) => {
	const m = gte(a, b) ? a : b
	dst.man = m.man
	dst.str = m.str
	dst.exp = m.exp
}
const _max = (a, b) => {
	const res = {}
	_maxTo(res, a, b)
	return res
}
const max = (a, b) => ec.max(a, b) ?? _max(a, b)

const _fromScientificTo = (dst, _man, _exp) => {
	let man = _man
	let exp = _exp
	while ((man % 10n) === 0n) {
		man /= 10n
		exp -= 1n
	}
	dst.man = man
	dst.str = I._abs(man).toString()
	dst.exp = exp
}
const _fromScientific = (man, exp) => {
	const res = {}
	_fromScientificTo(res, man, exp)
	return res
}
const fromScientific = (man, exp) => ec.fromScientific(man, exp)
	?? _fromScientific(man, exp)

const _fromIntegerTo = (dst, i) => {
	dst.man = i
	dst.str = i.toString()
	dst.exp = dst.str.length
}
const _fromInteger = (i) => {
	const res = {}
	_fromIntegerTo(res, i)
	return res
}
const fromInteger = (i) => ec.fromInteger(i, I) ?? _fromInteger(i)

const _toInteger = (x) => {
	if (x.exp >= 0n) { return x.man }
	if (x.exp <= -x.str.length) { return 0n }
	return x.man / 10n ** -x.exp
}
const toInteger = (x) => ec.toInteger(x, I) ?? _toInteger(x)

const _fromNumberTo = (dst, x) => {
	const s = x.toExponential()
	_fromStringTo(dst, s)
}
const _fromNumber = (n) => {
	const res = {}
	_fromNumberTo(res, n)
	return res
}
const fromNumber = (n) => ec.fromNumber(n) ?? _fromNumber(n)

const _toNumber = (x) => {
	const s = _toString(x)
	return parseFloat(s)
}
const toNumber = (x) => ec.toNumber(x) ?? _toNumber(x)

const _fromStringTo = (dst, s) => {
	const e = s.indexOf('e')
	const sman = s.slice(0, e)
	const sexp = s.slice(e + 1)
	const man = BigInt(sman)
	const exp = BigInt(sexp)
	_fromScientificTo(dst, man, exp)
}
const _fromString = (s) => {
	const res = {}
	this._fromStringTo(res, s)
	return res
}
const fromString = (s) => {
	const x = ec.fromString(s)
	if (x !== undefined) { return x }

	const match = s.match(/^(?<sman>-?\d+)e(?<sexp>[-+]?\d+)$/u)
	if (!match) { return NAN }

	const { sman, sexp } = match.groups
	const man = BigInt(sman)
	const exp = BigInt(sexp)
	return fromScientific(man, exp)
}

const _toString = (x) => `${x.man < 0n ? '-' : ''}${x.str}e${x.exp}`
const toString = (x) => ec.toString(x) ?? _toString(x)

const from = (x, y) => {
	if (y !== undefined) { return fromScientific(I.from(x), I.from(y)) }
	if (isMember(x)) { return x }
	if (typeof x === 'bigint') { return fromInteger(x) }
	if (typeof x === 'number') { return fromNumber(x) }
	if (typeof x === 'string') { return fromString(x) }
	return NAN
}

const Domain = {
	...{ PInfinity: P_INFINITY, NInfinity: N_INFINITY, NaN: NAN },
	...{ isMember, _isMember },
	...{ sign, _sign, _signTo },
	...{ abs, _abs, _absTo },
	...{ neg, _neg, _negTo },
	...{ add, _add, _addTo },
	...{ sub, _sub, _subTo },
	...{ mul, _mul, _mulTo },
	...{ div, _div, _divTo },
	...{ mod, _mod, _modTo },
	...{ inverse, _inverse, _inverseTo },
	...{ square, _square, _squareTo },
	...{ floor, _floor, _floorTo },
	...{ ceil, _ceil, _ceilTo },
	...{ round, _round, _roundTo },
	...{ int, _int, _intTo },
	...{ frac, _frac, _fracTo },
	...{ _eq, _neq, _lt, _gt, _lte, _gte },
	...{ eq, neq, lt, gt, lte, gte },
	...{ min, _min, _minTo },
	...{ max, _max, _maxTo },
	...{ toNumber, _toNumber },
	...{ fromNumber, _fromNumber, _fromNumberTo },
	...{ toString, _toString },
	...{ fromString, _fromString, _fromStringTo },
	...{ toInteger, _toInteger },
	...{ fromInteger, _fromInteger, _fromIntegerTo },
	...{ from },
	...{ _copy, _clone },
}

const { defineFor: defineEdgeCasesFor } = require('../edge-cases')
const ec = defineEdgeCasesFor(Domain)

module.exports = {
	...Domain,
	isFinite: ec.isFinite,
	isNaN: ec.isNaN,
}
