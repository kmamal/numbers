const BigIntJSON = require('../../bigint/json')

module.exports = function hash (x) {
	return JSON.stringify(x, BigIntJSON.replace)
}
