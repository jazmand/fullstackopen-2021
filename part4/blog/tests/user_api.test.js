const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/user');

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({
			username: 'hellas',
			name: 'Artos Hellas',
			passwordHash,
		});

		await user.save();
	});

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'hellas',
			name: 'Arto Hellas',
			password: 'salainen',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('`username` to be unique');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test('when username is not given', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'Michael Chan',
			password: 'salainen',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('username or password missing');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test('when password is not given', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'mchan',
			name: 'Michael Chan',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('username or password missing');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
});

test('when username is not atleast 3 characters long', async () => {
	const usersAtStart = await helper.usersInDb();

	const newUser = {
		username: 'm',
		name: 'Michael Chan',
		password: 'salainen',
	};

	const result = await api
		.post('/api/users')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	expect(result.body.error).toContain(
		'username and password must both be atleast 3 characters long'
	);

	const usersAtEnd = await helper.usersInDb();
	expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test('when password is not atleast 3 characters long', async () => {
	const usersAtStart = await helper.usersInDb();

	const newUser = {
		username: 'mchan',
		name: 'Michael Chan',
		password: 'sa',
	};

	const result = await api
		.post('/api/users')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	expect(result.body.error).toContain(
		'username and password must both be atleast 3 characters long'
	);

	const usersAtEnd = await helper.usersInDb();
	expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

afterAll(() => {
	mongoose.connection.close();
});
