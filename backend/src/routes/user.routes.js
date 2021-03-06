// External dependencies
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

// Internal dependencies
const { UserModel } = require('../models');
const { passport } = require('../config/passport');
const { authenticated, unauthenticated } = require('../auth');

/**
 * @api {get} /api/user/ Get all users
 */
router.get('/', authenticated, async (req, res) => {
	const { ids, names, emails } = req.query;

	const conditions = { deleted: false };

	if (ids) conditions.id = { [Op.in]: ids.split(',') };

	if (names) conditions.name = { [Op.in]: names.split(',') };

	if (emails) conditions.email = { [Op.in]: emails.split(',') };

	try {
		const users = await UserModel.findAll({ where: conditions, attributes: ['id', 'name', 'email'] });

		return res.status(200).json({
			success: true,
			message: 'Users retrieved successfully',
			data: users
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

/**
 * @api {post} /api/user/register Create a new user
 */
router.post('/register', unauthenticated, async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({
			success: false,
			message: 'Please provide all required fields'
		});
	}

	try {
		const user = await UserModel.create({ name, email, password });

		user.password = undefined;

		return res.status(200).json({
			success: true,
			message: 'User created successfully',
			data: [user]
		});
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json({
				success: false,
				message: 'Provided email is already in use'
			});
		} else if (error.name === 'SequelizeValidationError' && error.errors[0].path === 'email') {
			return res.status(400).json({
				success: false,
				message: 'Provided email is not valid'
			});
		} else {
			return res.status(500).json({
				success: false,
				message: error
			});
		}
	}
});

/**
 * @api {post} /api/user/login Login a user
 */
router.post('/login', unauthenticated, async (req, res) => {
	passport.authenticate('local', (error, user) => {
		if (error) {
			return res.status(500).json({
				success: false,
				message: error
			});
		} else if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Incorrect email or password'
			});
		} else {
			req.login(user, (error) => {
				if (error) {
					return res.status(500).json({
						success: false,
						message: error
					});
				}

				user.password = undefined;

				return res.status(200).json({
					success: true,
					message: 'User logged in successfully',
					data: [user]
				});
			});
		}
	})(req, res);
});

/**
 * @api {post} /api/user/logout Logout a user
 */
router.post('/logout', authenticated, (req, res) => {
	req.logout();
	return res.status(200).json({
		success: true,
		message: 'User logged out successfully'
	});
});

/**
 * @api {put} /api/user/ Update a user
 */
router.put('/', authenticated, async (req, res) => {
	const id = req.user ? req.user.dataValues.id : null;
	const { name, password } = req.body;
	const fields = {};

	if (name) fields.name = name;
	if (password) fields.password = password;

	if (Object.keys(fields).length === 0) {
		return res.status(400).json({
			success: false,
			message: 'Please provide at least one field to update'
		});
	}

	try {
		let user = await UserModel.findOne({ where: { id, deleted: false } });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		user = await user.update(fields);

		user.password = undefined;

		return res.status(200).json({
			success: true,
			message: 'User updated successfully',
			data: [user]
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

/**
 * @api {delete} /api/user/ Delete a user
 */
router.delete('/', authenticated, async (req, res) => {
	const id = req.user ? req.user.dataValues.id : null;

	try {
		const user = await UserModel.findOne({ where: { id, deleted: false } });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		await user.update({ deleted: true });

		return res.status(200).json({
			success: true,
			message: 'User deleted successfully'
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;
