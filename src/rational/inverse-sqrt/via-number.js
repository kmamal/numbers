const { toNumber, fromNumber } = require('../base')

const inverseSqrt = (rational) => {
	const m = toNumber(rational)
	const s = 1 / Math.sqrt(m)
	return fromNumber(s)
}

module.exports = { inverseSqrt }
