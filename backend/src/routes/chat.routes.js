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

/**
 * @api {post} /api/chat/ Create a new chat
 */
router.post('/', async (req, res) => {
	const id = req.user ? req.user.dataValues.id : null;
	const name = req.body.name;
	let members = req.body.members;

	if (!id) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a user id'
		});
	}

	if (!name) {
		return res.status(400).json({
			success: false,
			message: 'Please provide all required fields'
		});
	}

	if (!members) {
		return res.status(400).json({
			success: false,
			message: 'Please provide at least one member besides the owner'
		});
	} else {
		members = members.split(',');
		members.push(id);
	}

	try {
		const transaction = await sequelize.transaction();

		const chat = await ChatModel.create({ name, ownerId: id }, { transaction });

		// Add chat members (M:N relationship)
		const chatUsers = await chat.addUser(
			await UserModel.findAll({
				where: { id: members, deleted: false }
			}),
			{ transaction }
		);

		if (chatUsers.length <= 1) {
			await transaction.rollback();
			return res.status(500).json({
				success: false,
				message: 'Chat could not be created'
			});
		}

		await transaction.commit();

		res.status(200).json({
			success: true,
			message: 'Chat created successfully',
			data: [chat]
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: error
		});
	}
});

module.exports = router;
