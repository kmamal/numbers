const Constants = require('./constants')
const Expressions = require('./expressions')
const simplify = require('./simplify')
const derivative = require('./derivative')
const print = require('./print')
const random = require('./random')

const solveFor = (a, name) => {}
const _eval = (a, args) => {}
const fromFunction = (a, names) => {}
const toFunction = (a, names) => {}

module.exports = {
	...Constants,
	...Expressions,
	simplify,
	derivative,
	print,

	random,

	solveFor,
	eval: _eval,
	toFunction,
}
