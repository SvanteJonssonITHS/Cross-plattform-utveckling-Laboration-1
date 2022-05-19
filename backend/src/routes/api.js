// Dependencies
const express = require('express');

// Variable declaration
const router = express.Router();

router.get('/', async (_req, res) => {
	res.json({
		success: true,
		message: 'Welcome to the API'
	});
});

module.exports = router;
