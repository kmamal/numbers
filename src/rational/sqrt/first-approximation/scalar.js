const R = require('../../base')

const base = 10

const approximate = (a) => {
	const oneOver = a.num < a.den

	const whole = R.floor(!oneOver ? a : R.inverse(a))
	const string = whole.num.toString(base)
	const exponent = string.length - 1
	const halfExponent = Math.floor(exponent / 2)
	const roundExponent = halfExponent * 2
	const mantissa = parseInt(string.slice(0, -roundExponent), base)
	const k = (mantissa < 10 ? 2n : 6n) * 10n ** BigInt(halfExponent)

	return !oneOver
		? { num: k, den: 1n }
		: { num: 1n, den: k }
}

module.exports = { approximate }
