const R = require('../base')

const { approximate } = require('../sqrt/first-approximation/scalar')

const N = 6

const inverseSqrt = (a) => {
	const { num: anum, den: aden } = a

	if (anum < 0n || a === R.NaN) { return R.NaN }
	if (anum === 0n) { return R.PInfinity }
	if (a === R.PInfinity) { return { num: 0n, den: 1n } }

	let { num: sden, den: snum } = approximate(a)

	for (let i = 0; i < N; i++) {
		const tnum = anum * snum * snum
		const tden = aden * sden * sden
		snum *= 3n * tden - tnum
		sden *= 2n * tden
	}
	return { num: snum, den: sden }
}

module.exports = { inverseSqrt }
