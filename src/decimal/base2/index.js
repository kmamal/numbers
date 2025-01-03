const I = require('../../integer')
const Float = require('@kmamal/util/ieee-float/double')

const MAX_SAFE_MANTISSA = (1n << 53n) - 1n
const BIG_TWO_POW_52 = 1n << 52n

const base = 2n
const P_INFINITY = { base, man: I.PInfinity, exp: 0n }
const N_INFINITY = { base, man: I.NInfinity, exp: 0n }
const NAN = { base, man: I.NaN, exp: 0n }

const isFinite = (x) => I.isFinite(x.man)
const isNaN = (x) => I.isNaN(x.man)

const sign = (x) => I.sign(x.man)

const abs = (x) => ({
	base,
	man: I.abs(x.man),
	exp: x.exp,
})

const neg = (x) => ({
	base,
	man: -1n * x.man,
	exp: x.exp,
})

const add = (a, b) => {
	const test = I.add(a.man, b.man)
	if (!I.isFinite(test)) { return _normalize(test, 0n) }

	let man
	let exp
	if (a.exp < b.exp) {
		man = a.man + (b.man << (b.exp - a.exp))
		exp = a.exp
	} else {
		man = (a.man << (a.exp - b.exp)) + b.man
		exp = b.exp
	}
	return _normalize(man, exp)
}

const sub = (a, b) => {
	const test = I.sub(a.man, b.man)
	if (!I.isFinite(test)) { return _normalize(test, 0n) }

	let man
	let exp
	if (a.exp < b.exp) {
		man = a.man - (b.man << (b.exp - a.exp))
		exp = a.exp
	} else {
		man = (a.man << (a.exp - b.exp)) - b.man
		exp = b.exp
	}
	return _normalize(man, exp)
}

const mul = (a, b) => {
	const test = I.mul(a.man, b.man)
	if (!I.isFinite(test)) { return _normalize(test, 0n) }

	const man = a.man * b.man
	const exp = a.exp + b.exp
	return _normalize(man, exp)
}

const square = (x) => mul(x, x)

const pow = (x, e) => { // TODO: DOESNT WORK FOR NON-INTERGER EXPONENTS
	const man = I.pow(x.man, e)
	const exp = I.pow(x.exp, e)
	return _normalize(man, exp)
}

const floor = (x) => {
	if (!I.isFinite(x.man)) { return x }
	const whole = x.man << x.exp
	return _normalize(whole, 0n)
}

const frac = (x) => {
	if (!I.isFinite(x.man)) { return NAN }
	const rest = x.man % (1n << x.exp)
	return _normalize(rest, x.exp)
}

const eq = (a, b) => true
	&& !isNaN(a)
	&& !isNaN(b)
	&& a.man === b.man
	&& a.exp === b.exp

const neq = (a, b) => !eq(a, b)

const lt = (a, b) => {
	if (a.man < 0n && b.man >= 0n) { return true }
	if (a.man >= 0n && b.man < 0n) { return false }
	if (a.exp < b.exp) { return true }
	if (a.exp > b.exp) { return false }
	return I.lt(a.man, b.man)
}

const gt = (a, b) => lt(b, a)
const lte = (a, b) => lt(a, b) || eq(a, b)
const gte = (a, b) => lte(b, a)

const _normalize = (_man, _exp) => {
	let man = _man
	let exp = _exp
	while ((man % 2n) === 0n) {
		man >>= 1n
		exp -= 1n
	}
	return { base, man, exp }
}

const fromScientific = (man, exp) => {
	if (I.isNaN(man) || I.isNaN(exp)) { return NAN }
	if (exp === I.PInfinity) { return P_INFINITY }
	if (exp === I.NInfinity) { return N_INFINITY }
	if (man === I.PInfinity) { return P_INFINITY }
	if (man === I.NInfinity) { return N_INFINITY }
	return _normalize(man, exp)
}

const fromInteger = (x) => _normalize(x, 0n)

const fromNumber = (x) => { // TODO
	if (Number.isNaN(x)) { return NAN }
	if (x === Infinity) { return P_INFINITY }
	if (x === -Infinity) { return N_INFINITY }

	const { sign: s, exponent: e, mantissa: m } = Float.parse(x)
	const biased_exponent = BigInt(e - 1075)
	const mantissa = BigInt(m)

	const implicit_bit = e === 0 ? 0n : 4503599627370496n
	let num = (s ? -1n : 1n) * (implicit_bit + mantissa)
	let den = 1n
	if (e >= 1076) {
		num <<= biased_exponent
	} else {
		den <<= -biased_exponent
	}

	return _normalize(man, exp)
}

const toNumber = (x) => { // TODO
	if (x === NAN) { return NaN }
	if (x === P_INFINITY) { return Infinity }
	if (x === N_INFINITY) { return -Infinity }

	let man = x.man
	let exp = x.exp

	if (man > MAX_SAFE_MANTISSA) {
		do {
			man >>= 1n
			exp += 1n
		} while (man > MAX_SAFE_MANTISSA)
	} else {
		do {
			man <<= 1n
			exp -= 1n
		} while (man <= MAX_SAFE_MANTISSA)
		man >>= 1n
		exp += 1n
	}
	man -= BIG_TWO_POW_52

	if (exp > 971n) { return man < 0 ? N_INFINITY : P_INFINITY }
	if (exp < -1074n) { return 0 }

	const s = man < 0n ? 1 : 0
	const exponent = Number(exp) + 1023 + 52
	const mantissa = Number(man)
	console.log({ s, exponent, mantissa, b: man.toString(16), man, exp })
	return Float.from({ sign: s, exponent, mantissa })
}

const fromString = (s) => {
	const match = s.match(/^(?<whole>-?\d+)(?:\.(?<decimal>\d+))?(?:[bB](?<exp>-?\d+))?$/u)
	if (!match) { return NAN }
	const { whole, decimal = '', exp = '1' } = match.groups

	const _man = BigInt(`${whole}${decimal}`)
	const _exp = BigInt(exp) - BigInt(decimal.length)
	return fromScientific(_man, _exp)
}

const toString = (x) => {
	if (x === NAN) { return 'NaN' }
	if (x === P_INFINITY) { return 'Infinity' }
	if (x === N_INFINITY) { return '-Infinity' }
	return `${x.man}b${x.exp}`
}

module.exports = {
	__info: {
		name: 'decimal-base-2',
		isPrimitive: false,
	},
	...{ PInfinity: P_INFINITY, NInfinity: N_INFINITY, NaN: NAN },
	...{ isFinite, isNaN },
	...{ sign, abs, neg, add, sub, mul, pow, square },
	...{ floor, frac },
	...{ eq, neq, lt, gt, lte, gte },
	...{ fromScientific, fromInteger },
	...{ fromNumber, toNumber },
	...{ fromString, toString },
}
