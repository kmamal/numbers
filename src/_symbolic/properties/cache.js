
const k_cache = Symbol('cache')
let index = 0

const _ensureCache = (expression) => {
	let cache = expression[k_cache]
	if (!cache) {
		cache = new Map()
		expression[k_cache] = cache
	}
	return cache
}

const getCached = (expression, property) => {
	const cache = expression[k_cache]
	return cache && cache.get(property)
}

const setCached = (expression, property, value) => {
	const cache = _ensureCache(expression)
	cache.set(property, value)
}

const cached = (func) => {
	const property = func.name || `prop-${index}`
	index += 1

	return (expression) => {
		const cache = _ensureCache(expression)

		let value = getCached(expression, property)
		if (value !== undefined) { return value }

		value = func(expression)
		cache.set(property, value)

		return value
	}
}

module.exports = {
	cached,
	getCached,
	setCached,
}
