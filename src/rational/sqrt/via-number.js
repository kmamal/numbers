const { toNumber, fromNumber } = require('../base')

const sqrt = (rational) => {
	const m = toNumber(rational)
	const s = Math.sqrt(m)
	return fromNumber(s)
}

module.exports = { sqrt }
