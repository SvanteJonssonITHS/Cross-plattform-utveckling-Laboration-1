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
		res.status(500).json({
			success: false,
			message: error
		});
	}
});

/**
 * @api {put} /api/chat/ Update a chat
 */
router.put('/', async (req, res) => {
	const ownerId = req.user ? req.user.dataValues.id : null;
	const { id, name } = req.body;
	let members = req.body.members;
	const fields = {};

	if (!id) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a chat id'
		});
	}

	if (name) fields.name = name;
	if (members) {
		members = members.split(',');
		members.push(ownerId);
		if (members.length > 1) {
			fields.members = members;
		}
	}

	if (Object.keys(fields).length === 0) {
		return res.status(400).json({
			success: false,
			message: 'Please provide at least one field to update'
		});
	}

	try {
		let chat = await ChatModel.findByPk(id);

		if (!chat) {
			res.status(404).json({
				success: false,
				message: 'Chat not found'
			});
		}

		chat = await chat.update(fields);

		if (fields.members) {
			const newMembers = await UserModel.findAll({
				where: { id: members, deleted: false }
			});

			if (newMembers.length > 1) {
				let oldMembers = await chat.getUsers();
				await chat.removeUser(oldMembers);
				await chat.setUsers(newMembers);
			} else {
				res.status(500).json({
					success: false,
					message: 'Chat could not be updated'
				});
			}
		}

		res.status(200).json({
			success: true,
			message: 'Chat updated successfully',
			data: [chat]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

/**
 * @api {delete} /api/chat/ Delete a chat
 */
router.delete('/', async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a chat id'
		});
	}

	try {
		const chat = await ChatModel.findByPk(id);

		if (!chat) {
			res.status(404).json({
				success: false,
				message: 'Chat not found'
			});
		}

		await chat.destroy();

		res.status(200).json({
			success: true,
			message: 'Chat deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;
