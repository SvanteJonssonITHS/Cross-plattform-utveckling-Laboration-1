// External dependencies
const express = require('express');
const router = express.Router();

// Internal dependencies
const { sequelize } = require('../config/mySQL');
const { ChatModel, UserModel } = require('../models');

/**
 * @api {get} /api/chat/ Get all chats for a user
 */
router.get('/', async (req, res) => {
	const id = req.user ? req.user.dataValues.id : null;

	if (!id) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a user id'
		});
	}

	try {
		const chats = await ChatModel.findAll({ where: { ownerId: id } });
		res.status(200).json({
			success: true,
			message: 'Chats retrieved successfully',
			data: chats
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;
