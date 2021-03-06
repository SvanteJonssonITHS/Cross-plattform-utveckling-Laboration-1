// External dependencies
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Internal dependencies
const { sequelize } = require('../config/mySQL');

const user = sequelize.define('user', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	deleted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

user.addHook('beforeCreate', async (user) => {
	user.password = await bcrypt.hash(user.password, 10);
});

user.addHook('beforeUpdate', async (user) => {
	if (user.changed('password')) {
		user.password = await bcrypt.hash(user.password, 10);
	}
});

user.prototype.validPassword = function (password) {
	return bcrypt.compare(password, this.password);
};

module.exports = user;
