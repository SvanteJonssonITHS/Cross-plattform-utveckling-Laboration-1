// Dependencies
const { ChatModel, UserModel, MessageModel } = require('../models');

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

			let newMessage = await MessageModel.create({
				chatId,
				userId,
				message
			});

			if (!newMessage) return;

			newMessage = await MessageModel.findOne({
				where: { id: newMessage.id, deleted: false },
				include: [
					{
						model: UserModel,
						as: 'user',
						attributes: ['id', 'name']
					}
				]
			});

			socketIO.emit(`chat-${chatId}`, newMessage);
		});
	});
};
