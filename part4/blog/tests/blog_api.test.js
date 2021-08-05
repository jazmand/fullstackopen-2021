const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const initialBlogs = [
	{
		title: 'First blog post',
		author: 'Judi',
		url: 'www.blog.com',
		likes: 2,
	},
	{
		title: 'Second blog post',
		author: 'Yukiko',
		url: 'www.secondblog.com',
		likes: 4,
	},
];
beforeEach(async () => {
	await Blog.deleteMany({});
	let blogObject = new Blog(initialBlogs[0]);
	await blogObject.save();
	blogObject = new Blog(initialBlogs[1]);
	await blogObject.save();
});

test('all blogs are returned as json', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
	const response = await api.get('/api/blogs');

	const titles = response.body.map((r) => r.title);
	expect(titles).toContain('Second blog post');
});

test('unique identifier property of the blog posts is named id', async () => {
	const response = await api.get('/api/blogs');

	const doesIdExist = response.body.every((r) => r.id) ? true : undefined;
	expect(doesIdExist).toBeDefined();
});

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'Third blog post',
		author: 'Crystal',
		url: 'www.thirdblog.com',
		likes: 6,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');

	const titles = response.body.map((r) => r.title);

	expect(response.body).toHaveLength(initialBlogs.length + 1);
	expect(titles).toContain('Third blog post');
});

test('when title and/or url properties are missing status code 400 is returned', async () => {
	const newBlog = {
		title: 'Third blog post',
	};

	await api.post('/api/blogs').send(newBlog).expect(400);

	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(initialBlogs.length);
});

afterAll(() => {
	mongoose.connection.close();
});
