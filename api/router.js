'use strict';

module.exports = function (app) {
	var urlsController = require('./controller/urls_controller');
	//	userHandlers = require('../controllers/userController.js');

	// Urls Routes
	app.route('/get')
		.post(urlsController.get_url);
	app.route('/create')
		.post(urlsController.create_url);
	app.route('/create/vcode')
		.post(urlsController.create_vcode);
	app.route('/validate/vcode')
		.post(urlsController.validate_vcode);

	// app.route('/tasks/:taskId')
	// 	.get(todoList.read_a_task)
	// 	.put(todoList.update_a_task)
	// 	.delete(todoList.delete_a_task);


	// ////////
	// app.route('/auth/register')
	// 	.post(userHandlers.register);

	// app.route('/auth/sign_in')
	// 	.post(userHandlers.sign_in);
};