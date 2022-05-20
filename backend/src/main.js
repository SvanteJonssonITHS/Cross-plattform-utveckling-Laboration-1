// Import dotenv
require('dotenv').config();

// External dependencies
const express = require('express');
const session = require('express-session');
const history = require('connect-history-api-fallback');
const path = require('path');

// Internal dependencies
const { passport, initializePassport } = require('./config/passport');
const { sequelize, connectToMySQL } = require('./config/mySQL');
const establishAssociations = require('./config/associations');

// Variable declaration
const app = express();
const port = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret';
const sessionOptions = {
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
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

(async () => {
	try {
		// Connect to MySQL
		await connectToMySQL();

		// Validate connection
		await sequelize.authenticate();

		// Establish associations
		await establishAssociations();

		// Sync MySQL models
		await sequelize.sync();

		// Initialize passport
		initializePassport();

		// Start the server
		app.listen(port, () => {
			console.log(`Server is running on port ${port}\nAccess it on http://localhost:${port}`);
		});
	} catch (error) {
		console.log(error);
	}
})();
