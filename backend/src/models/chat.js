// External dependencies
const { DataTypes } = require('sequelize');

// Internal dependencies
const { sequelize } = require('../config/mySQL');

const chat = sequelize.define('chat', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	deleted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

module.exports = chat;
