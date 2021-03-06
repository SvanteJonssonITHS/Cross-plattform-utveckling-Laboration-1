// External dependencies
const { DataTypes } = require('sequelize');

// Internal dependencies
const { sequelize } = require('../config/mySQL');

const message = sequelize.define('message', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	message: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	deleted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

module.exports = message;
