const R = require('../base')

const sin = (a) => R.fromNumber(Math.sin(R.toNumber(a)))
const cos = (a) => R.fromNumber(Math.cos(R.toNumber(a)))
const tan = (a) => R.fromNumber(Math.tan(R.toNumber(a)))
const asin = (y) => R.fromNumber(Math.asin(R.toNumber(y)))
const acos = (x) => R.fromNumber(Math.acos(R.toNumber(x)))
const atan = (d) => R.fromNumber(Math.atan(R.toNumber(d)))
const atan2 = (y, x) => R.fromNumber(Math.atan2(
	R.toNumber(y),
	R.toNumber(x),
))

module.exports = {
	sin,
	cos,
	tan,
	asin,
	acos,
	atan,
	atan2,
}
