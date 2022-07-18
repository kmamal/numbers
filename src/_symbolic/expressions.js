const Props = require('./properties')

const _cache = new Map()

const _cached = (expression) => {
	let hashed = Props.getCached(expression, 'hash')
	if (hashed !== undefined) { return expression }

	hashed = Props.uncached.hash(expression)
	const cached = _cache.get(hashed)
	if (cached) { return cached }

	Props.setCached(expression, 'hash', hashed)
	_cache.set(hashed, expression)
	return expression
}

const neg = (a) => _cached([ 'neg', a ])
const add = (a, b) => _cached([ 'add', a, b ])
const sub = (a, b) => _cached([ 'sub', a, b ])
const mul = (a, b) => _cached([ 'mul', a, b ])
const div = (a, b) => _cached([ 'div', a, b ])
const pow = (b, e) => _cached([ 'pow', b, e ])
const log = (b, x) => _cached([ 'log', b, x ])
const exp = (a) => _cached([ 'exp', a ])
const ln = (a) => _cached([ 'ln', a ])
const sin = (a) => _cached([ 'sin', a ])
const cos = (a) => _cached([ 'cos', a ])

module.exports = {
	neg,
	add,
	sub,
	mul,
	div,
	pow,
	log,
	exp,
	ln,
	sin,
	cos,
	_cache,
	_cached,
}
