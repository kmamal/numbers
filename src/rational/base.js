const I = require('../integer')
const gcd = require('@kmamal/math/gcd').defineFor(I)
const Float = require('@kmamal/util/ieee-float/double')

const TWO_POW_53 = 2 ** 53

const P_INFINITY = Symbol("Infinity (Rational)")
const N_INFINITY = Symbol("-Infinity (Rational)")
const NAN = Symbol("NaN (Rational)")

const PATTERN = /^(?<snum>-?\d+)\/(?<sden>\d+)$/u

const _copy = (dst, src) => {
	dst.num = src.num
	dst.den = src.den
}
const _clone = (x) => ({
	num: x.num,
	den: x.den,
})

const _isMember = (x) => true
	&& x
	&& typeof x === 'object'
	&& I.isMember(x.num)
	&& I.isMember(x.den)
const isMember = (x) => ec.isMember(x) ?? _isMember(x)

const _signTo = (dst, x) => {
	dst.num = I._sign(x.num)
	dst.den = 1n
}
const _sign = (x) => {
	const res = {}
	_signTo(res, x)
	return res
}
const sign = (x) => ec.sign(x) ?? _sign(x)

const _absTo = (dst, x) => {
	dst.num = I._abs(x.num)
	dst.den = x.den
}
const _abs = (x) => {
	const res = {}
	_absTo(res, x)
	return res
}
const abs = (x) => ec.abs(x) ?? _abs(x)

const _negTo = (dst, x) => {
	dst.num = -x.num
	dst.den = x.den
}
const _neg = (x) => {
	const res = {}
	_negTo(res, x)
	return res
}
const neg = (x) => ec.neg(x) ?? _neg(x)

const _addTo = (dst, a, b) => {
	const num = a.num * b.den + b.num * a.den
	const den = a.den * b.den
	_fromFractionTo(dst, num, den)
}
const _add = (a, b) => {
	const res = {}
	_addTo(res, a, b)
	return res
}
const add = (a, b) => ec.add(a, b) ?? _add(a, b)

const _subTo = (dst, a, b) => {
	const num = a.num * b.den - b.num * a.den
	const den = a.den * b.den
	_fromFractionTo(dst, num, den)
}
const _sub = (a, b) => {
	const res = {}
	_subTo(res, a, b)
	return res
}
const sub = (a, b) => ec.sub(a, b) ?? _sub(a, b)

const _mulTo = (dst, a, b) => {
	const num = a.num * b.num
	const den = a.den * b.den
	_fromFractionTo(dst, num, den)
}
const _mul = (a, b) => {
	const res = {}
	_mulTo(res, a, b)
	return res
}
const mul = (a, b) => ec.mul(a, b) ?? _mul(a, b)

const _divTo = (dst, a, b) => {
	const num = a.num * b.den
	const den = a.den * b.num
	_fromFractionTo(dst, num, den)
}
const _div = (a, b) => {
	const res = {}
	_divTo(res, a, b)
	return res
}
const div = (a, b) => ec.div(a, b) ?? _div(a, b)

const _modTo = (dst, a, b) => {
	const num = (a.num * b.den) % (b.num * a.den)
	const den = a.den * b.den
	_fromFractionTo(dst, num, den)
}
const _mod = (a, b) => {
	const res = {}
	_modTo(res, a, b)
	return res
}
const mod = (a, b) => ec.mod(a, b) ?? _mod(a, b)

const _inverseTo = (dst, x) => _fromFractionTo(dst, x.den, x.num)
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
	let whole = x.num / x.den
	if (x.num < 0n && x.num % x.den !== 0n) { whole-- }
	_fromIntegerTo(dst, whole)
}
const _floor = (x) => {
	const res = {}
	_floorTo(res, x)
	return res
}
const floor = (x) => ec.floor(x) ?? _floor(x)

const _ceilTo = (dst, x) => {
	let whole = x.num / x.den
	if (x.num > 0n && x.num % x.den !== 0n) { whole++ }
	_fromIntegerTo(dst, whole)
}
const _ceil = (x) => {
	const res = {}
	_ceilTo(res, x)
	return res
}
const ceil = (x) => ec.ceil(x) ?? _ceil(x)

const _roundTo = (dst, x) => {
	const whole = x.num / x.den
	const rest = x.num % x.den
	return x.num >= 0n
		? _fromIntegerTo(dst, 2n * rest >= x.den ? whole + 1n : whole)
		: _fromIntegerTo(dst, 2n * -rest > x.den ? whole - 1n : whole)
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
	const rest = x.num % x.den
	_fromFractionTo(dst, rest, x.den)
}
const _frac = (x) => {
	const res = {}
	_fracTo(res, x)
	return res
}
const frac = (x) => ec.frac(x) ?? _frac(x)

const roundTo = (x, bits) => {
	const { num } = x
	const s = num < 0 ? -1n : 1n
	let absNum = s * num
	let { den } = x

	const c = 2n ** BigInt(bits)
	if (absNum > den) {
		while (den > c) {
			absNum >>= 1n
			den >>= 1n
		}
	} else {
		while (absNum > c) {
			absNum >>= 1n
			den >>= 1n
		}
	}
	return fromFraction(s * absNum, den)
}

const _eq = (a, b) => true
	&& a.num === b.num
	&& a.den === b.den
const eq = (a, b) => ec.eq(a, b) ?? _eq(a, b)

const _neq = (a, b) => false
	|| a.num !== b.num
	|| a.den !== b.den
const neq = (a, b) => ec.neq(a, b) ?? _neq(a, b)

const _lt = (a, b) => a.num * b.den < b.num * a.den
const lt = (a, b) => ec.lt(a, b) ?? _lt(a, b)

const _gt = (a, b) => a.num * b.den > b.num * a.den
const gt = (a, b) => ec.gt(a, b) ?? _gt(a, b)

const _lte = (a, b) => a.num * b.den <= b.num * a.den
const lte = (a, b) => ec.lte(a, b) ?? _lte(a, b)

const _gte = (a, b) => a.num * b.den >= b.num * a.den
const gte = (a, b) => ec.gte(a, b) ?? _gte(a, b)

const _minTo = (dst, a, b) => {
	const m = lte(a, b) ? a : b
	dst.num = m.num
	dst.den = m.den
}
const _min = (a, b) => {
	const res = {}
	_minTo(res, a, b)
	return res
}
const min = (a, b) => ec.min(a, b) ?? _min(a, b)

const _maxTo = (dst, a, b) => {
	const m = _gte(a, b) ? a : b
	dst.num = m.num
	dst.den = m.den
}
const _max = (a, b) => {
	const res = {}
	_maxTo(res, a, b)
	return res
}
const max = (a, b) => ec.max(a, b) ?? _max(a, b)

const _fromFractionTo = (dst, num, den) => {
	if (num === 0n) {
		dst.num = 0n
		dst.den = 1n
		return
	}

	const factor = gcd(num, den)
	let rNum = num / factor
	let rDen = den / factor

	if (rDen < 0n) {
		rNum = -rNum
		rDen = -rDen
	}

	dst.num = rNum
	dst.den = rDen
}
const _fromFraction = (num, den) => {
	const res = {}
	_fromFractionTo(res, num, den)
	return res
}
const fromFraction = (x, y) => ec.fromFraction(x, y, I) ?? _fromFraction(x, y)

const _fromIntegerTo = (dst, i) => {
	dst.num = i
	dst.den = 1n
}
const _fromInteger = (i) => {
	const res = {}
	_fromIntegerTo(res, i)
	return res
}
const fromInteger = (i) => ec.fromInteger(i, I) ?? _fromInteger(i, 1n)

const _toInteger = (x) => x.num / x.den
const toInteger = (x) => ec.toInteger(x, I) ?? _toInteger(x)

const _fromNumberTo = (dst, x) => {
	if (x === 0) {
		dst.num = 0n
		dst.den = 1n
		return
	}

	if (x === Math.floor(x)) {
		_fromIntegerTo(dst, BigInt(x))
		return
	}

	const { sign: s, exponent: e, mantissa: m } = Float.parse(x)

	let num = BigInt((s ? -1 : 1) * (m + Float.HIDDEN_BIT))
	let den = 1n
	const shift = BigInt(e - Float.EXPONENT_BIAS - Float.MANTISSA_BITS)
	if (shift >= 0n) {
		num <<= shift
	} else {
		den <<= -shift
	}

	_fromFractionTo(dst, num, den)
}
const _fromNumber = (n) => {
	const res = {}
	_fromNumberTo(res, n)
	return res
}
const fromNumber = (n) => ec.fromNumber(n) ?? _fromNumber(n)

const _toNumber = (x) => {
	const { num, den } = x
	if (num === 0n) { return 0 }

	const s = I._sign(num)
	const absNum = s * num
	const overOne = absNum > den
	const digits = overOne
		? (absNum << 53n) / den
		: (den << 53n) / absNum
	const whole = digits >> 53n
	const rest = digits - (whole << 53n)
	const number = Number(s) * (Number(whole) + Number(rest) / TWO_POW_53)
	return overOne ? number : 1 / number
}
const toNumber = (x) => ec.toNumber(x) ?? _toNumber(x)

const _fromStringTo = (dst, s) => {
	const bar = s.indexOf('/')
	const snum = s.slice(0, bar)
	const sden = s.slice(bar + 1)
	const num = BigInt(snum)
	const den = BigInt(sden)
	_fromFractionTo(dst, num, den)
}
const _fromString = (s) => {
	const res = {}
	this._fromStringTo(res, s)
	return res
}
const fromString = (s) => {
	const x = ec.fromString(s)
	if (x !== undefined) { return x }

	const match = s.match(PATTERN)
	if (!match) { return NAN }

	const { snum, sden } = match.groups
	const num = BigInt(snum)
	const den = BigInt(sden)
	return fromFraction(num, den)
}

const _toString = (x) => `${x.num}/${x.den}`
const toString = (x) => ec.toString(x) ?? _toString(x)

const from = (x, y) => {
	if (y !== undefined) { return fromFraction(I.from(x), I.from(y)) }
	if (isMember(x)) { return x }
	if (typeof x === 'bigint') { return fromInteger(x) }
	if (typeof x === 'number') { return fromNumber(x) }
	if (typeof x === 'string') { return fromString(x) }
	return NAN
}


const Algebra = {
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
	...{ roundTo },
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
	...{ fromFraction, _fromFraction, _fromFractionTo },
	...{ from },
	...{ _copy, _clone },
}

const ec = require('../edge-cases').defineFor(Algebra)

module.exports = {
	...Algebra,
	isFinite: ec.isFinite,
	isNaN: ec.isNaN,
}
