const I = require('../../integer')

const P_INFINITY = Symbol("Infinity (Decimal)")
const N_INFINITY = Symbol("-Infinity (Decimal)")
const NAN = Symbol("NaN (Decimal)")

const ONE = { man: 1n, len: 1n, exp: 0n }

const _copy = (dst, src) => {
	dst.man = src.man
	dst.len = src.len
	dst.exp = src.exp
}
const _clone = (x) => ({
	man: x.man,
	str: x.len,
	exp: x.exp,
})

const _isMember = (x) => true
	&& x
	&& typeof x === 'object'
	&& I.isMember(x.man)
	&& I.isMember(x.len)
	&& I.isMember(x.exp)
const isMember = (x) => ec.isMember(x) ?? _isMember(x)

const _signTo = (dst, x) => {
	const man = I._sign(x.man)
	dst.man = man
	if (man === 0n) {
		dst.len = 0n
		dst.exp = 0n
	} else {
		dst.len = 1n
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
	dst.len = x.len
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
	dst.len = x.len
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
	const shifts = a.exp - b.exp
	if (shifts > 0n) {
		man = a.man * 10n ** shifts + b.man
		exp = b.exp
	} else if (shifts < 0n) {
		man = a.man + b.man * 10n ** -shifts
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
	const shifts = a.exp - b.exp
	if (shifts > 0n) {
		man = a.man * 10n ** shifts - b.man
		exp = b.exp
	} else if (shifts < 0n) {
		man = a.man - b.man * 10n ** -shifts
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

// TODO: not so simple - needs precision
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
	if (x.man < 0n && x.exp < 0n) { whole-- }
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
	if (x.man > 0n && x.exp < 0n) { whole++ }
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

	const signedOne = I._sign(x.man)
	const doubleWhole = x.exp > -x.len
		? (2n * x.man) / 10n ** -x.exp
		: 0n
	_fromIntegerTo(dst, (doubleWhole + signedOne) / 2n)
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
	if (x.exp >= 0n) {
		dst.man = 0n
		dst.len = 0n
		dst.exp = 0n
		return
	}

	if (x.exp <= -x.len) {
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
const neq = (a, b) => ec.neq(a, b) ?? _neq(a, b)

const _cmp = (a, b) => {
	if (a.man === b.man && a.exp === b.exp) { return 0 }

	const isNegA = a.man < 0n
	const isNegB = b.man < 0n
	if (isNegA && !isNegB) { return -1 }
	if (!isNegA && isNegB) { return 1 }

	const isZeroA = a.man === 0n
	const isZeroB = b.man === 0n
	if (isZeroA) { return !isNegB && !isZeroB ? -1 : 1 }
	if (isZeroB) { return isNegA ? -1 : 1 }

	const aScale = a.exp + a.len
	const bScale = b.exp + b.len
	if (aScale < bScale) { return isNegA ? 1 : -1 }
	if (aScale > bScale) { return isNegA ? -1 : 1 }

	const shifts = a.exp - b.exp
	const lt = shifts > 0n
		? a.man * 10n ** shifts < b.man
		: a.man < b.man * 10n ** -shifts
	return lt ? -1 : 1
}

const _lt = (a, b) => _cmp(a, b) < 0
const lt = (a, b) => ec.lt(a, b) ?? _lt(a, b)

const _gt = (a, b) => _cmp(a, b) > 0
const gt = (a, b) => ec.gt(a, b) ?? _gt(a, b)

const _lte = (a, b) => _cmp(a, b) <= 0
const lte = (a, b) => ec.lte(a, b) ?? _lte(a, b)

const _gte = (a, b) => _cmp(a, b) >= 0
const gte = (a, b) => ec.gte(a, b) ?? _gte(a, b)

const _minTo = (dst, a, b) => {
	const m = lte(a, b) ? a : b
	dst.man = m.man
	dst.len = m.len
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
	dst.len = m.len
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
	let len
	if (man === 0n) {
		exp = 0n
		len = 0n
	} else {
		while ((man % 10n) === 0n) {
			man /= 10n
			exp += 1n
		}
		len = BigInt(I._abs(man).toString().length)
	}
	dst.man = man
	dst.len = len
	dst.exp = exp
}
const _fromScientific = (man, exp) => {
	const res = {}
	_fromScientificTo(res, man, exp)
	return res
}
const fromScientific = (man, exp) => ec.fromScientific(man, exp, I)
	?? _fromScientific(man, exp)

const _fromIntegerTo = (dst, i) => _fromScientificTo(dst, i, 0n)
const _fromInteger = (i) => {
	const res = {}
	_fromIntegerTo(res, i)
	return res
}
const fromInteger = (i) => ec.fromInteger(i, I) ?? _fromInteger(i)

const _toInteger = (x) => {
	if (x.exp === 0n) { return x.man }
	if (x.exp > 0n) { return x.man * 10n ** x.exp }
	if (x.exp <= -x.len) { return 0n }
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
	const eIndex = s.indexOf('e')
	const manStr = s.slice(0, eIndex)
	const expStr = s.slice(eIndex + 1)

	let dotIndex = manStr.indexOf('.')
	if (dotIndex === -1) { dotIndex = manStr.length }
	const manStrWhole = manStr.slice(0, dotIndex)
	const manStrFrac = manStr.slice(dotIndex + 1)

	const shift = BigInt(manStrFrac.length)
	const man = BigInt(manStrWhole) * 10n ** shift + BigInt(manStrFrac)
	const exp = BigInt(expStr) - shift
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

	const match = s.match(/^(?<sman>[-+]?\d+)e(?<sexp>[-+]?\d+)$/u)
	if (!match) { return NAN }

	const { sman, sexp } = match.groups
	const man = BigInt(sman)
	const exp = BigInt(sexp)
	return fromScientific(man, exp)
}

const _toString = (x) => `${x.man}e${x.exp}`
const toString = (x) => ec.toString(x) ?? _toString(x)

const from = (x, y) => {
	if (y !== undefined) { return fromScientific(I.from(x), I.from(y)) }
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
	...{ fromScientific, _fromScientific, _fromScientificTo },
	...{ from },
	...{ _copy, _clone },
}

const ec = require('../../edge-cases').defineFor(Algebra)

module.exports = {
	__info: {
		name: 'decimal-base-10',
		isPrimitive: false,
	},
	...Algebra,
	isFinite: ec.isFinite,
	isNaN: ec.isNaN,
}
