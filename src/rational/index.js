
module.exports = {
	__info: {
		name: 'rational',
		isPrimitive: false,
	},
	...require('./base'),
	...require('./sqrt/via-number'),
	...require('./inverse-sqrt/via-sqrt'),
	...require('./trig/via-number'),
}
