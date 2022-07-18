const { cached, getCached, setCached } = require('./cache')

const hash = require('./hash')
const variables = require('./variables')

module.exports = {
	getCached,
	setCached,
	uncached: {
		hash,
		variables,
	},
	hash: cached(hash),
	variables: cached(variables),
}
