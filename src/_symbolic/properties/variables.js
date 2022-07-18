
module.exports = function variables (x) {
	if (typeof x === 'string') { return [ x ] }
	if (!Array.isArray(x)) { return [] }
	return x.slice(1).map(variables).flat()
}
