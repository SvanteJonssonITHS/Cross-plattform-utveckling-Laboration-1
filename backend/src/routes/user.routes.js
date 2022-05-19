// External dependencies
const express = require('express');
const router = express.Router();

// Internal dependencies
const { Op } = require('sequelize');
const { UserModel } = require('../models');

/**
 * @api {get} /api/user/ Get all users
 */
router.get('/', async (req, res) => {
	const { ids, names, emails } = req.query;

	const conditions = {};

	if (ids) conditions.id = { [Op.in]: ids.split(',') };

	if (names) conditions.name = { [Op.in]: names.split(',') };

	if (emails) conditions.email = { [Op.in]: emails.split(',') };

	try {
		const users = await UserModel.findAll({ where: conditions });
		res.status(200).json({
			success: true,
			message: 'Users retrieved successfully',
			data: users
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;
