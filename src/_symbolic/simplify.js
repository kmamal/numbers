const Constants = require('./constants')
const S = require('./expressions')
const R = require('../rational')
const fp = require('lodash/fp')

const _simplifyInverseFunctions = (_x) => {
	let x = _x

	// --X = X
	if (x[0] === 'neg') {
		if (x[1][0] === 'neg') {
			x = x[1][1]
		}
	}

	// POW(B, LN(B, X)) = X
	if (x[0] === 'pow') {
		if (x[2][0] === 'log') {
			if (fp.isEqual(x[1], x[2][1])) {
				x = x[2][2]
			}
		}
	}

	// LN(B, POW(B, X)) = X
	if (x[0] === 'log') {
		if (x[2][0] === 'pow') {
			if (fp.isEqual(x[1], x[2][1])) {
				x = x[2][2]
			}
		}
	}

	return x
}

const _simplifyTerms = () => {}
const _simplifyFactors = () => {}
const _simplifyFractions = () => {}

// merge constants under: add, sub, mul, div

const simplify = (_x) => {
	let x = _x

	// Numbers -> Rational
	if (typeof x === 'number') {
		const r = R.fromFloat(x)
		return S.div(r.num, r.den)
	}

	if (!Array.isArray(x) || x.length === 1) { return x }

	if (x.length === 3) {
		x = [ x[0], simplify(x[1]), simplify(x[2]) ]
	} else if (x.length === 2) {
		x = [ x[0], simplify(x[1]) ]
	}

	// X + 0 = X
	if (x[0] === 'add') {
		if (x[1] === 0) {
			x = x[2]
		} else if (x[2] === 0) {
			x = x[1]
		}
	}

	// X - 0 = X
	if (x[0] === 'sub') {
		if (x[1] === 0) {
			x = x[2]
		} else if (x[2] === 0) {
			x = x[1]
		}
	}

	// X + -Y = X - Y
	if (x[0] === 'add') {
		if (x[2][0] === 'neg') {
			x = S.sub(x[1], x[2][1])
		}
	}

	// X - -Y = X + Y
	if (x[0] === 'sub') {
		if (x[2][0] === 'neg') {
			x = S.add(x[1], x[2][1])
		}
	}

	// -X + Y = Y - X
	if (x[0] === 'add') {
		if (x[1][0] === 'neg' && x[2][0] !== 'neg') {
			x = S.sub(x[2], x[1][1])
		}
	}

	// X * 0 = 0
	if (x[0] === 'mul') {
		if (x[1] === 0 || x[2] === 0) {
			x = 0
		}
	}

	// X * 1 = X
	if (x[0] === 'mul') {
		if (x[1] === 1) {
			x = x[2]
		} else if (x[2] === 1) {
			x = x[1]
		}
	}

	// X / 1 = X
	if (x[0] === 'div') {
		if (x[2] === 1) {
			x = x[1]
		}
	}

	// 0 ^ X = 0
	if (x[0] === 'pow') {
		if (x[1] === 0) {
			x = 0
		}
	}

	// 1 ^ X = 1
	if (x[0] === 'pow') {
		if (x[1] === 1) {
			x = 1
		}
	}

	// Temporary for simplifying
	// EXP(X) = POW(E, X)
	if (x[0] === 'exp') {
		x = S.pow(Constants.E, x[1])
	}
	// Temporary for simplifying
	// LN(X) = LOG(E, X)
	if (x[0] === 'ln') {
		x = S.log(Constants.E, x[1])
	}

	// X ^ 0 = 1
	if (x[0] === 'pow') {
		if (x[2] === 0) {
			x = 1
		}
	}

	// X ^ 1 = X
	if (x[0] === 'pow') {
		if (x[2] === 1) {
			x = x[1]
		}
	}

	// Make pretty again
	// POW(E, X) = EXP(X)
	if (x[0] === 'pow') {
		if (x[1] === Constants.E) {
			x = S.exp(x[2])
		}
	}
	// Make pretty again
	// LOG(E, X) = LN(X)
	if (x[0] === 'log') {
		if (x[1] === Constants.E) {
			x = S.ln(x[2])
		}
	}

	return x
}

module.exports = simplify
