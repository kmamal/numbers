const R = require('../base')
const { sqrt } = require('../sqrt/newton')

const inverseSqrt = (a) => R.inverse(sqrt(a))

module.exports = { inverseSqrt }
