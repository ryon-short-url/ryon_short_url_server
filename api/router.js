'use strict';

module.exports = function (app) {
	///////////////////////////////////////
	//innit
	///////////////////////////////////////
	var urlsController = require('./controllers/urls_controller'),
		Auth = require('./controllers/auth_controller'),
		authJwt = require('../middlewares/authJwt');
	const auth = new Auth();
	const passport = require('passport');
	const cookieSession = require('cookie-session');
	require('../untils/passport');
	app.use(cookieSession({
		name: 'google-auth-session',
		keys: ['key1', 'key2']
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	///////////////////////////////////////
	//innit
	///////////////////////////////////////

	// Auth Routes
	app.get('/api/auth/google',
		passport.authenticate('google', {
			scope:
				['email', 'profile']
		}
		));

	app.get('/auth/google/callback',
		passport.authenticate('google', {
			failureRedirect: '/failed',
		}),
		auth.googleSignin
	);
	app.get("/failed", (req, res) => {
		res.send("Failed")
	});

	app.get("/logout", (req, res) => {
		req.session = null;
		req.logout();
		res.redirect('/');
	});

	// Urls Routes
	app.route('/get')
<<<<<<< HEAD
		.post([authJwt.verifyToken, authJwt.isAdmin], urlsController.get_url);
	app.route('/create')
		.post(urlsController.create_url);
	app.route('/create/vcode')
		.post([authJwt.verifyToken, authJwt.isAdmin], urlsController.create_vcode);
=======
		.post(urlsController.get_url);
	app.route('/create')
		.post(urlsController.create_url);
	app.route('/create/vcode')
		.post(urlsController.create_vcode);
>>>>>>> d71e3847edf3b32ad5637e785842617514c87927
	app.route('/validate/vcode')
		.post(urlsController.validate_vcode);

};