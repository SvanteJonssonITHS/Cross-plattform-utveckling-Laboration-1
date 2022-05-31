// Dependencies
const { Sequelize } = require('sequelize');
const mysql = require('mysql2');

// MySQL Login Credintials
const MYSQLHOST = process.env.MYSQLHOST || 'localhost';
const MYSQLUSER = process.env.MYSQLUSER || 'root';
const MYSQLPASS = process.env.MYSQLPASS || '1234';
const MYSQLDB = process.env.MYSQLDB || 'testdb';

exports.sequelize = new Sequelize(`mysql://${MYSQLUSER}:${MYSQLPASS}@${MYSQLHOST}:3306/${MYSQLDB}`, { logging: false });

exports.connectToMySQL = () => {
	return new Promise((resolve) => {
		// Open the connection to MySQL server
		const connection = mysql.createConnection({
			host: MYSQLHOST,
			user: MYSQLUSER,
			password: MYSQLPASS
		});

		// Run create database statement
		connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQLDB}`, () => {
			console.log(`Database "${MYSQLDB}" was created successfully.`);
			resolve();
		});

		// Close the connection
		connection.end();
	});
};
