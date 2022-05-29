// Dependencies
const { ChatModel, MessageModel } = require('../models');

// Variable declaration
let socketIO;

exports.websocketRoutes = (io) => {
	socketIO = io;

	socketIO.on('connection', (socket) => {
		socket.on('message', async (chatId, { userId, message }) => {
			const chat = await ChatModel.findOne({
				where: { id: chatId, deleted: false }
			});

			if (!chat) return;

			const newMessage = await MessageModel.create({
				chatId,
				userId,
				message
			});

			if (!newMessage) return;

			socket.emit(`chat-${chatId}`, newMessage);
		});
	});
};
