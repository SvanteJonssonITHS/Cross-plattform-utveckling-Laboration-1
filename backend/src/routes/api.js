// Dependencies
const express = require('express');

// Variable declaration
const router = express.Router();

router.use('/chat', require('./chat.routes'));
router.use('/user', require('./user.routes'));

router.get('/', async (_req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the API'
	});
});

router.all('*', async (_req, res) => {
	res.status(404).json({
		success: false,
		message: 'Invalid endpoint'
	});
});

module.exports = router;
