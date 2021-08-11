const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
	const users = await User.find({});
	response.json(users);
});

usersRouter.post('/', async (request, response) => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(body.password, saltRounds);

	const user = new User(request.body, passwordHash);

	const savedUser = await user.save();

	response.json(savedUser);
});

module.exports = usersRouter;
