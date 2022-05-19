// Import dotenv
require('dotenv').config();

// External dependencies
const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');

// Variable declaration
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use((err, _req, res, _next) => {
	res.status(400).json({
		success: false,
		error: err.message
	});
});

// Routes
app.use('/api', require('./routes/api.js'));

// Serve static files from the React app
app.use(history());
app.use('/', express.static(path.join(path.resolve(), '../frontend/dist')));

app.listen(port, () => {
	console.log(`Server is running on port ${port}\nAccess it on http://localhost:${port}`);
});
