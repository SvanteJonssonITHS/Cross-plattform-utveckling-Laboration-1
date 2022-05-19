// Import models
const { ChatModel, MessageModel, UserModel } = require('../models');

module.exports = async () => {
	// 1:N association between User and Message
	await UserModel.hasMany(MessageModel, { foreignKey: 'userId' });
	await MessageModel.belongsTo(UserModel, { foreignKey: 'userId' });

	// 1:N association between Chat and Message
	await ChatModel.hasMany(MessageModel, { foreignKey: 'chatId' });
	await MessageModel.belongsTo(ChatModel, { foreignKey: 'chatId' });

	// 1:N association between User and Chat
	await UserModel.hasMany(ChatModel, { foreignKey: 'ownerId' });
	await ChatModel.belongsTo(UserModel, { foreignKey: 'ownerId' });

	// M:N association between User and Chat
	await UserModel.belongsToMany(ChatModel, { through: 'chatUser' });
	await ChatModel.belongsToMany(UserModel, { through: 'chatUser' });
};
