const S = require('./expressions')
const Props = require('./properties')
const simplify = require('./simplify')
const print = require('./print')

const _hasVariable = (x, name) => Props.variables(x).includes(name)

const _derivative = (f, name) => {
	if (f === name) { return 1 }
	if (f.length === 1 || !_hasVariable(f, name)) { return 0 }
	switch (f[0]) {
		case 'add': {
			const [ , a, b ] = f
			const da = derivative(a, name)
			const db = derivative(b, name)
			return S.add(da, db)
		}
		case 'sub': {
			const [ , a, b ] = f
			const da = derivative(a, name)
			const db = derivative(b, name)
			return S.sub(da, db)
		}
		case 'mul': {
			const [ , a, b ] = f
			const da = derivative(a, name)
			const db = derivative(b, name)
			return S.add(S.mul(da, b), S.mul(a, db))
		}
		case 'div': {
			const [ , a, b ] = f
			const da = derivative(a, name)
			const db = derivative(b, name)
			return S.div(S.sub(S.mul(da, b), S.mul(a, db)), S.pow(b, 2))
		}
		case 'exp': {
			const [ , e ] = f
			const de = derivative(e, name)
			return S.mul(de, f)
		}
		case 'ln': {
			const [ , x ] = f
			const dx = derivative(x, name)
			return S.div(dx, x)
		}
		case 'pow': {
			const [ , b, e ] = f
			const db = derivative(b, name)
			const de = derivative(e, name)
			return S.mul(f, S.add(S.mul(db, S.div(e, b)), S.mul(de, S.ln(b))))
		}
		case 'log': {
			const [ , b, e ] = f
			return derivative(S.div(S.ln(e), S.ln(b)), name)
		}
		case 'sin': {
			const [ , x ] = f
			const dx = derivative(x, name)
			return S.mul(dx, S.cos(x))
		}
		case 'cos': {
			const [ , x ] = f
			const dx = derivative(x, name)
			return S.neg(S.mul(dx, S.sin(x)))
		}
		default: throw new Error("wat")
	}
}

const derivative = (x, name) => {
	const result = _derivative(x, name)
	const simple = simplify(result)
	console.log(print({ derivative: { func: x, name, result, simple } }))
	return simple
}

module.exports = derivative
