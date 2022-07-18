const R = require('../base')
const { inverseSqrt } = require('../inverse-sqrt/newton')

const sqrt = (a) => R.inverse(inverseSqrt(a))

module.exports = { sqrt }
