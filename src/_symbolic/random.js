const Constants = require('./constants')
const S = require('./expressions')
const fp = require('lodash/fp')

const atoms = [
	...fp.values(Constants),
	...[ 0n, 1n, 2n, 3n ],
]

const unary = [ S.neg, S.sin, S.cos, S.exp, S.ln ]

const binary = [ S.add, S.sub, S.mul, S.div, S.pow, S.log ]

const random = (n) => {
	if (n === 0) { throw new Error("failed") }
	if (n === 1) { return fp.sample(atoms) }
	if (n === 2) { return fp.sample(unary)(random(1)) }

	const op = fp.sample(binary)
	const left = fp.random(1, n - 2)
	const right = (n - left) - 1
	return op(random(left), random(right))
}

module.exports = random
