'use strict';

module.exports = function (app) {
	///////////////////////////////////////
	//innit
	///////////////////////////////////////
	var urlsController = require('./controllers/urls_controller'),
		blogController = require('./controllers/blog_controller'),
		examController = require('./controllers/exam_controller'),
		dictController = require('./controllers/dict_controller'),
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
	// app.route('/get')
	// 	.post([authJwt.verifyToken, authJwt.isAdmin], urlsController.get_url);
	app.route('/get')
		.post([authJwt.verifyToken, authJwt.isAdmin], urlsController.get_url);
	app.route('/create')
		.post(urlsController.create_url);
	app.route('/create/vcode')
		.post(urlsController.create_vcode);
	app.route('/validate/vcode')
		.post(urlsController.validate_vcode);

	// // Blog Routes
	// app.route('/create/mappingblog')
	// 	.post(blogController.create_mapping_blog);
	// app.route('/get/mappingblog')
	// 	.post(blogController.get_mapping_blog);
	// app.route('/delete/mappingblog')
	// 	.post(blogController.delete_mapping_blog);
	app.route('/get/posts')
		.get(blogController.get_posts);

	//Exam create
	app.route('/create/exam')
		.post(examController.create_exam);

	//Exam update
	app.route('/update/exam')
		.post(examController.update_exam);

	//Exam post
	app.route('/get/exam')
		.post(examController.get_exam);

	//Exam post
	app.route('/get/counterExam')
		.get(examController.get_counter_exam);


	//Dict
	app.route('/get/dict')
		.post(dictController.get_dict);

};