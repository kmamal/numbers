const { memoize } = require('@kmamal/util/function/memoize')

const defineFor = memoize((D) => {
	const {
		PInfinity: P_INFINITY,
		NInfinity: N_INFINITY,
		NaN: NAN,
	} = D
	const ZERO = D._fromNumber(0)
	const ONE = D._fromNumber(1)
	const MINUS_ONE = D._fromNumber(-1)

	const _getSignedInfinity = (x) => D._lt(x, ZERO) ? N_INFINITY : P_INFINITY

	const isNaN = (x) => x === NAN

	const isFinite = (x) => true
		&& D._isMember(x)
		&& x !== NAN
		&& x !== P_INFINITY
		&& x !== N_INFINITY

	/* eslint-disable consistent-return */

	const isMember = (x) => {
		if (false
			|| x === NAN
			|| x === P_INFINITY
			|| x === N_INFINITY
		) { return true }
	}

	const sign = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY) { return ONE }
		if (x === N_INFINITY) { return MINUS_ONE }
	}

	const neg = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY) { return N_INFINITY }
		if (x === N_INFINITY) { return P_INFINITY }
	}

	const abs = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY || x === N_INFINITY) { return P_INFINITY }
	}

	const add = (a, b) => {
		if (false
			|| a === NAN || b === NAN
			|| (a === P_INFINITY && b === N_INFINITY)
			|| (a === N_INFINITY && b === P_INFINITY)
		) { return NAN }
		if (a === P_INFINITY || b === P_INFINITY) { return P_INFINITY }
		if (a === N_INFINITY || b === N_INFINITY) { return N_INFINITY }
	}

	const sub = (a, b) => {
		if (false
			|| a === NAN || b === NAN
			|| (a === P_INFINITY && b === P_INFINITY)
			|| (a === N_INFINITY && b === N_INFINITY)
		) { return NAN }
		if (a === P_INFINITY || b === N_INFINITY) { return P_INFINITY }
		if (a === N_INFINITY || b === P_INFINITY) { return N_INFINITY }
	}

	const mul = (a, b) => {
		if (a === NAN || b === NAN) { return NAN }
		if (false
			|| a === P_INFINITY
			|| a === N_INFINITY
			|| b === P_INFINITY
			|| b === N_INFINITY
		) { return _getSignedInfinity(D.sign(a) * D.sign(b)) }
	}

	const div = (a, b) => {
		if (
			(a === NAN || b === NAN)
			|| (true
				&& (a === P_INFINITY || a === N_INFINITY)
				&& (b === P_INFINITY || b === N_INFINITY)
			)
			|| (D.eq(a, ZERO) && D.eq(b, ZERO))
		) { return NAN }
		if (a === P_INFINITY || a === N_INFINITY) {
			return _getSignedInfinity(sign(a) * D.sign(b))
		}
		if (b === P_INFINITY || b === N_INFINITY) { return ZERO }
		if (D._eq(b, ZERO)) { return _getSignedInfinity(D._sign(a)) }
	}

	const mod = (a, b) => {
		if (false
			|| a === NAN
			|| b === NAN
			|| a === P_INFINITY
			|| a === N_INFINITY
			|| b === P_INFINITY
			|| b === N_INFINITY
			|| D._eq(b, ZERO)
		) { return NAN }
	}

	const inverse = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY || x === N_INFINITY) { return ZERO }
		if (D._eq(x, ZERO)) { return NAN }
	}

	const pow = (a, b) => {
		if (b === NAN) { return NAN }
		if (D.eq(b, ZERO)) { return ONE }

		if (a === NAN) { return NAN }

		if (!isFinite(b)) {
			const absBase = D.abs(a)
			if (D.eq(absBase, ONE)) { return NAN }

			const magnBase = D.sign(D.sub(absBase, ONE))
			const signExp = sign(b)
			return D.eq(D.mul(magnBase, signExp), MINUS_ONE) ? ZERO : P_INFINITY
		}

		if (a === P_INFINITY) { return D._lt(ZERO, b) ? P_INFINITY : ZERO }
		if (a === N_INFINITY) {
			if (D._lt(b, ZERO)) { return ZERO }
			const oddExp = D._eq(D._mod(b, 2), ONE)
			return _getSignedInfinity(oddExp ? MINUS_ONE : ONE)
		}

		if (D._eq(a, ZERO)) { return D._lt(ZERO, b) ? ZERO : P_INFINITY }
	}

	const floor = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY) { return P_INFINITY }
		if (x === N_INFINITY) { return N_INFINITY }
	}

	const ceil = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY) { return P_INFINITY }
		if (x === N_INFINITY) { return N_INFINITY }
	}

	const round = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY) { return P_INFINITY }
		if (x === N_INFINITY) { return N_INFINITY }
	}

	const int = (x) => {
		if (x === NAN) { return NAN }
		if (x === P_INFINITY) { return P_INFINITY }
		if (x === N_INFINITY) { return N_INFINITY }
	}

	const frac = (x) => {
		if (false
			|| x === NAN
			|| x === P_INFINITY
			|| x === N_INFINITY
		) { return NAN }
	}

	const eq = (a, b) => {
		if (a === NAN && b === NAN) { return false }
	}

	const neq = eq

	const lt = (a, b) => {
		if (a === NAN || b === NAN) { return false }
		if (a === P_INFINITY) { return false }
		if (a === N_INFINITY) { return b !== N_INFINITY }
		if (b === P_INFINITY) { return a !== P_INFINITY }
		if (b === N_INFINITY) { return false }
	}

	const gt = (a, b) => lt(b, a)

	const lte = (a, b) => {
		if (a === NAN || b === NAN) { return false }
		if (a === P_INFINITY) { return false }
		if (a === N_INFINITY) { return true }
		if (b === P_INFINITY) { return true }
		if (b === N_INFINITY) { return false }
	}

	const gte = (a, b) => lte(b, a)

	const min = (a, b) => {
		if (a === NAN || b === NAN) { return NAN }
		if (a === N_INFINITY || b === N_INFINITY) { return N_INFINITY }
		if (a === P_INFINITY) { return b }
		if (b === P_INFINITY) { return a }
	}

	const max = (a, b) => {
		if (a === NAN || b === NAN) { return NAN }
		if (a === P_INFINITY || b === P_INFINITY) { return P_INFINITY }
		if (a === N_INFINITY) { return b }
		if (b === N_INFINITY) { return a }
	}

	const fromString = (s) => {
		if (s === 'Infinity') { return P_INFINITY }
		if (s === '-Infinity') { return N_INFINITY }
		if (s === 'NaN') { return NAN }
	}

	const toString = (x) => {
		if (x === P_INFINITY) { return 'Infinity' }
		if (x === N_INFINITY) { return '-Infinity' }
		if (x === NAN) { return 'NaN' }
	}

	const fromNumber = (x) => {
		if (x === Infinity) { return P_INFINITY }
		if (x === -Infinity) { return N_INFINITY }
		if (Number.isNaN(x)) { return NAN }
	}

	const toNumber = (x) => {
		if (x === P_INFINITY) { return Infinity }
		if (x === N_INFINITY) { return -Infinity }
		if (x === NAN) { return NaN }
	}

	const fromInteger = (x, I) => {
		if (x === I.PInfinity) { return P_INFINITY }
		if (x === I.PInfinity) { return N_INFINITY }
		if (x === I.NAN) { return NAN }
	}

	const toInteger = (x, I) => {
		if (x === P_INFINITY) { return I.PInfinity }
		if (x === N_INFINITY) { return I.NInfinity }
		if (x === NAN) { return I.NaN }
	}

	const fromFraction = (num, den, I) => fromInteger(I.edgeCases.div(num, den))

	const fromScientific = (man, exp, I) => {
		const first = I.edgeCases.pow(10n, exp) ?? 10n
		const second = I.edgeCases.mul(man, first)
		return second === undefined ? second : D.fromInteger(second)
	}

	return {
		...{ isNaN, isFinite },
		...{ isMember },
		...{ sign, neg, abs },
		...{ add, sub, mul, div, mod, inverse, pow },
		...{ eq, neq, lt, lte, gt, gte, min, max },
		...{ floor, ceil, round, int, frac },
		...{ fromString, toString },
		...{ fromNumber, toNumber },
		...{ fromInteger, toInteger },
		...{ fromFraction },
		...{ fromScientific },
	}
})

module.exports = { defineFor }
