const R = require('../base')

const { approximate } = require('./first-approximation/scalar')

const N = 20

const sqrt = (a) => {
	const { num: anum, den: aden } = a

	if (anum < 0n) { return R.NaN }
	if (!R.isFinite(a)) { return a }

	let { num: snum, den: sden } = approximate(a)

	for (let i = 0; i < N; i++) {
		const tnum = anum * sden
		const tden = aden * snum
		snum = snum * tden + tnum * sden
		sden = 2n * sden * tden
		;({ num: snum, den: sden } = R.roundTo({ num: snum, den: sden }, 128))
	}

	return R.roundTo({ num: snum, den: sden }, 64)
}

module.exports = { sqrt }
