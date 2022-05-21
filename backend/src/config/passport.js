// External dependencies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Local dependencies
const { UserModel } = require('../models');

const initializePassport = () => {
	passport.use(
		// Set the strategy to use
		new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
			const user = await UserModel.findOne({ where: { email, deleted: false } });
			if (!user || !(await user.validPassword(password))) {
				return done(null, false, { message: 'Incorrect email or password.' });
			} else {
				user.deleted = undefined;
				return done(null, user);
			}
		})
	);

	// Serialize user into the session
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// Deserialize user from the session
	passport.deserializeUser(async (id, done) => {
		const user = await UserModel.findOne({ where: { id, deleted: false } });
		done(null, user);
	});
};

module.exports = { passport, initializePassport };
