const PrettyJson = require('../../../pretty-json')

const print = (x) => PrettyJson.stringify(x, (key, value) => typeof value === 'bigint' ? `${value}` : value)

module.exports = print
