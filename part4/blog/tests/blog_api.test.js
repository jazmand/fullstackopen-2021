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

afterAll(() => {
	mongoose.connection.close();
});
