const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
	await Blog.deleteMany({});
	let blogObject = new Blog(helper.initialBlogs[0]);
	await blogObject.save();
	blogObject = new Blog(helper.initialBlogs[1]);
	await blogObject.save();
});

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
	const response = await api.get('/api/blogs');

	const titles = response.body.map((r) => r.title);
	expect(titles).toContain('React patterns');
});

test('unique identifier property of the blog posts is named id', async () => {
	const response = await api.get('/api/blogs');

	const doesIdExist = response.body.every((r) => r.id) ? true : undefined;
	expect(doesIdExist).toBeDefined();
});

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();

	const titles = blogsAtEnd.map((r) => r.title);

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
	expect(titles).toContain('First class tests');
});

test('blog without likes property will default to the value 0', async () => {
	const newBlog = {
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
	};

	await api.post('/api/blogs').send(newBlog).expect(201);

	const response = await api.get('/api/blogs');
	const blogIndex = response.body.length - 1;
	const isLikesZero = response.body[blogIndex].likes;
	console.log(isLikesZero);

	expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
	expect(isLikesZero).toBe(0);
});

test('when title and/or url properties are missing status code 400 is returned', async () => {
	const newBlog = {
		title: 'First class tests',
	};

	await api.post('/api/blogs').send(newBlog).expect(400);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
	mongoose.connection.close();
});
