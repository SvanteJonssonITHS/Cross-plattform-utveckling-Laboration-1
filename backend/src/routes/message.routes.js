// External dependencies
const express = require('express');
const router = express.Router();

// Internal dependencies
const { ChatModel, MessageModel } = require('../models');

/**
 * @api {get} /api/message/ Get all messages for a chat
 */
router.get('/', async (req, res) => {
	const { chatId } = req.query;

	if (!chatId) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a chat id'
		});
	}

	try {
		const chat = await ChatModel.findOne({ where: { id: chatId } });

		if (!chat) {
			return res.status(400).json({
				success: false,
				message: 'Chat not found'
			});
		}

		const messages = await MessageModel.findAll({ where: { chatId } });
		res.status(200).json({
			success: true,
			message: 'Messages retrieved successfully',
			data: messages
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

/**
 * @api {post} /api/message/ Create a new message
 */
router.post('/', async (req, res) => {
	const userId = req.user ? req.user.dataValues.id : null;
	const { message, chatId } = req.body;

	if (!userId) {
		return res.status(400).json({
			success: false,
			message: 'Please provide a user id'
		});
	}

	if (!message || !chatId) {
		return res.status(400).json({
			success: false,
			message: 'Please provide all required fields'
		});
	}

	try {
		const chat = await ChatModel.findOne({ where: { id: chatId } });

		if (!chat) {
			return res.status(400).json({
				success: false,
				message: 'Chat not found'
			});
		}

		const newMsg = await MessageModel.create({
			message,
			userId,
			chatId
		});

		res.status(200).json({
			success: true,
			message: 'Message created successfully',
			data: [newMsg]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error
		});
	}
});

module.exports = router;
