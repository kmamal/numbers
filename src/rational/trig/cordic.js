const R = require('../base')
const { sqrt } = require('../sqrt/newton')

const N = 53

const ZERO = R.fromNumber(0)
const HALF = R.fromNumber(1 / 2)
const ONE = R.fromNumber(1)
const TWO = R.fromNumber(2)
const PI = R.fromNumber(Math.PI)
const TWO_PI = R.mul(PI, TWO)
const HALF_PI = R.div(PI, TWO)

const _cache = [ { sin: ONE, cos: ZERO, angle: HALF_PI } ]

const _sincosOfHalfAngles = (i) => {
	if (i < _cache.length) { return _cache[i] }

	const prev = _cache[i - 1]
	const halfPrevCos = R.div(prev.cos, TWO)
	const nextSin = sqrt(R.sub(HALF, halfPrevCos))
	let nextCos = sqrt(R.add(HALF, halfPrevCos))
	const nextAngle = R.div(prev.angle, TWO)

	if (R.gt(nextCos, ONE)) { nextCos = R.inverse(nextCos) }

	const result = {
		sin: nextSin,
		cos: nextCos,
		angle: nextAngle,
	}

	_cache[i] = result
	return result
}

// NOTE: input angle must be in [0,PI/2]
const _cordicRotate = (a) => {
	let angle = ZERO
	let x = ONE
	let y = ZERO
	for (let i = 0; i < N; i++) {
		if (R.eq(angle, a)) { break }

		const { cos: c, sin: _s, angle: _increment } = _sincosOfHalfAngles(i)
		let s
		let increment
		if (R.gt(angle, a)) {
			s = R.neg(_s)
			increment = R.neg(_increment)
		} else {
			s = _s
			increment = _increment
		}

		const nextX = R.sub(R.mul(x, c), R.mul(y, s))
		const nextY = R.add(R.mul(x, s), R.mul(y, c))
		x = R.roundTo(nextX, 128)
		y = R.roundTo(nextY, 128)

		angle = R.add(angle, increment)
	}

	return { x, y }
}

const sin = (_a) => {
	let a = _a
	if (!R.isFinite(a)) { return R.NaN }

	let neg = false
	if (R.lt(a, ZERO)) {
		a = R.neg(a)
		neg = true
	}
	a = R.mod(a, TWO_PI)
	if (R.gt(a, PI)) {
		a = R.sub(a, PI)
		neg = !neg
	}
	if (R.gt(a, HALF_PI)) {
		a = R.sub(PI, a)
	}

	const { y } = _cordicRotate(a)
	return R.roundTo(neg ? R.neg(y) : y, 64)
}

const cos = (_a) => {
	let a = _a
	if (!R.isFinite(a)) { return R.NaN }

	let neg = false
	if (R.lt(a, ZERO)) {
		a = R.neg(a)
	}
	a = R.mod(a, TWO_PI)
	if (R.gt(a, PI)) {
		a = R.sub(TWO_PI, a)
	}
	if (R.gt(a, HALF_PI)) {
		a = R.sub(PI, a)
		neg = !neg
	}

	const { x } = _cordicRotate(a)
	return R.roundTo(neg ? R.neg(x) : x, 64)
}

const tan = (_a) => {
	let a = _a
	if (!R.isFinite(a)) { return R.NaN }

	let neg = false
	if (R.lt(a, ZERO)) {
		a = R.neg(a)
		neg = !neg
	}
	a = R.mod(a, PI)
	if (R.gt(a, HALF_PI)) {
		a = R.sub(PI, a)
		neg = !neg
	}

	const { x, y } = _cordicRotate(a)
	const d = R.div(y, x)
	return R.roundTo(neg ? R.neg(d) : d, 64)
}

// NOTE: input vector must be in [-PI/2,PI/2]
const _cordicVectorize = (_x, _y) => {
	let x = _x
	let y = _y
	let angle = ZERO
	for (let i = 0; i < N; i++) {
		if (R.eq(y, ZERO)) { break }

		const { cos: c, sin: _s, angle: _increment } = _sincosOfHalfAngles(i)
		let s
		let increment
		if (R.gt(y, ZERO)) {
			s = R.neg(_s)
			increment = _increment
		} else {
			s = _s
			increment = R.neg(_increment)
		}

		const nextX = R.sub(R.mul(x, c), R.mul(y, s))
		const nextY = R.add(R.mul(x, s), R.mul(y, c))
		x = R.roundTo(nextX, 128)
		y = R.roundTo(nextY, 128)

		angle = R.add(angle, increment)
	}

	return angle
}

const asin = (y) => {
	if (R.isNaN(y)) { return R.NaN }
	if (R.gt(R.abs(y), ONE)) { return R.NaN }

	const x = sqrt(R.sub(ONE, R.square(y)))

	const a = _cordicVectorize(x, y)
	return R.roundTo(a, 64)
}

const acos = (_x) => {
	let x = _x
	if (R.isNaN(x)) { return R.NaN }

	let neg = false
	if (R.lt(x, ZERO)) {
		x = R.neg(x)
		neg = true
	}

	if (R.gt(x, ONE)) { return R.NaN }

	const y = sqrt(R.sub(ONE, R.square(x)))

	const a = _cordicVectorize(x, y)
	return R.roundTo(neg ? R.sub(PI, a) : a, 64)
}

const atan = (d) => {
	if (R.eq(d, ZERO)) { return ZERO }

	const y = d
	const x = ONE
	return atan2(y, x)
}

const atan2 = (_y, _x) => {
	let x = _x
	let y = _y

	if (!R.isFinite(x) || !R.isFinite(y)) { return R.NaN }
	if (R.eq(x, ZERO) && R.eq(y, ZERO)) { return ZERO }

	let neg = false
	let both = false
	if (R.lt(x, ZERO)) {
		both = R.lt(y, ZERO)
		x = R.neg(x)
		y = R.neg(y)
		neg = true
	}

	const a = _cordicVectorize(x, y)
	return R.roundTo(
		neg
			? both
				? R.sub(a, PI)
				: R.add(a, PI)
			: a,
		64,
	)
}

module.exports = {
	sin,
	cos,
	tan,
	asin,
	acos,
	atan,
	atan2,
}
