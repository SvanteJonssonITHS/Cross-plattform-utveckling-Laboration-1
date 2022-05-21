const authenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).json({
		success: false,
		message: 'Unauthorized'
	});
};

const unauthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.status(401).json({
		success: false,
		message: 'Authenticated'
	});
};

module.exports = { authenticated, unauthenticated };
