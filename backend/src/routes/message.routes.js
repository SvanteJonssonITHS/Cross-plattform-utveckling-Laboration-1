// External dependencies
const express = require('express');
const router = express.Router();

// Internal dependencies
const { ChatModel, MessageModel, UserModel } = require('../models');
const { authenticated } = require('../auth');

/**
 * @api {get} /api/message/ Get all messages for a chat
 */
router.get('/', authenticated, async (req, res) => {
	const userId = req.user ? req.user.dataValues.id : null;
	const chatId = req.query.chatId;
	const limit = req.query.limit || 0;

	if (!chatId) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a chat id'
		});
	}

	try {
		const chat = await ChatModel.findOne({
			where: { id: chatId, deleted: false },
			include: [
				{
					model: UserModel,
					as: 'users',
					attributes: ['id', 'name']
				},
				{
					model: MessageModel,
					as: 'messages',
					attributes: ['id', 'message', 'createdAt', 'updatedAt'],
					limit: parseInt(limit),
					order: [['createdAt', 'DESC']],
					include: [
						{
							model: UserModel,
							as: 'user',
							attributes: ['id', 'name']
						}
					]
				}
			]
		});

		if (!chat) {
			return res.status(400).json({
				success: false,
				message: 'Chat not found'
			});
		}

		// Check if the user is part of the chat
		if (!chat.users.find((user) => user.id === userId)) {
			return res.status(400).json({
				success: false,
				message: 'You are not part of this chat'
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Messages retrieved successfully',
			data: chat.messages
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

/**
 * @api {post} /api/message/ Create a new message
 */
router.post('/', authenticated, async (req, res) => {
	const userId = req.user ? req.user.dataValues.id : null;
	const { message, chatId } = req.body;

	if (!message || !chatId) {
		return res.status(400).json({
			success: false,
			message: 'Please provide all required fields'
		});
	}

	try {
		const chat = await ChatModel.findOne({
			where: { id: chatId, deleted: false },
			include: [
				{
					model: UserModel,
					as: 'users',
					attributes: ['id']
				}
			]
		});

		if (!chat) {
			return res.status(400).json({
				success: false,
				message: 'Chat not found'
			});
		}

		// Check if the user is part of the chat
		if (!chat.users.find((user) => user.dataValues.id === userId)) {
			return res.status(400).json({
				success: false,
				message: 'You are not part of this chat'
			});
		}

		const newMsg = await MessageModel.create({
			message,
			userId,
			chatId
		});

		return res.status(200).json({
			success: true,
			message: 'Message created successfully',
			data: [newMsg]
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error
		});
	}
});

/**
 * @api {put} /api/message/ Update a message
 */
router.put('/', authenticated, async (req, res) => {
	const userId = req.user ? req.user.dataValues.id : null;
	const { message, id } = req.body;

	if (!id) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a message id'
		});
	}

	if (!message) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a message value'
		});
	}

	try {
		const messageObj = await MessageModel.findOne({ where: { id, userId, deleted: false } });

		if (!messageObj) {
			return res.status(400).json({
				success: false,
				message: 'Message not found'
			});
		}

		await messageObj.update({ message });

		return res.status(200).json({
			success: true,
			message: 'Message updated successfully',
			data: [messageObj]
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

/**
 * @api {delete} /api/message/ Delete a message
 */
router.delete('/', authenticated, async (req, res) => {
	const userId = req.user ? req.user.dataValues.id : null;
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a message id'
		});
	}

	try {
		const message = await MessageModel.findOne({ where: { id, userId, deleted: false } });
		if (!message) {
			return res.status(404).json({
				success: false,
				message: 'Message not found'
			});
		}

		await message.update({ deleted: true });

		return res.status(200).json({
			success: true,
			message: 'Message deleted successfully'
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;
