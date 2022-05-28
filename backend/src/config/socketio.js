// External Dependencies
const socketIO = require('socket.io');

// Internal Dependencies
const { websocketRoutes } = require('../routes/api.websocket.js');

exports.socketIOSetup = async (server) => {
	const io = socketIO(server);
	websocketRoutes(io);
};
