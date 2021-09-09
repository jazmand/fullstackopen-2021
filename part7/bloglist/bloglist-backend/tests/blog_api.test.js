const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

const userLogin = {
	username: 'test',
	password: 'password',
};

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
});

beforeAll(async () => {
	await User.deleteMany({});
	const user = {
		username: 'test',
		name: 'test user',
		password: 'password',
	};

	await api
		.post('/api/users')
		.send(user)
		.set('Accept', 'application/json')
		.expect('Content-Type', /application\/json/);
});

describe('when there are initially some blogs saved', () => {
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
});

describe('checking if blogs adhere to certain naming specifications', () => {
	test('unique identifier property of the blog posts is named id', async () => {
		const response = await api.get('/api/blogs');

		const doesIdExist = response.body.every((r) => r.id) ? true : undefined;
		expect(doesIdExist).toBeDefined();
	});
});
describe('addition of a new blog', () => {
	test('a valid blog can be added', async () => {
		const loggedUser = await api
			.post('/api/login')
			.send(userLogin)
			.expect('Content-Type', /application\/json/);

		const newBlog = {
			title: 'First class tests',
			author: 'Robert C. Martin',
			url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
			likes: 10,
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${loggedUser.body.token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();

		const titles = blogsAtEnd.map((r) => r.title);

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
		expect(titles).toContain('First class tests');
	});

	test('blog without likes property will default to the value 0', async () => {
		const loggedUser = await api
			.post('/api/login')
			.send(userLogin)
			.expect('Content-Type', /application\/json/);

		const newBlog = {
			title: 'First class tests',
			author: 'Robert C. Martin',
			url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		};

		const response = await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${loggedUser.body.token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(response.body.likes).toBeDefined();
		expect(response.body.likes).toBe(0);
	});

	test('when title and/or url properties are missing status code 400 is returned', async () => {
		const loggedUser = await api
			.post('/api/login')
			.send(userLogin)
			.expect('Content-Type', /application\/json/);

		const newBlog = {
			title: 'First class tests',
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${loggedUser.body.token}`)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

describe('deletion of a blog', () => {
	test('a blog can be deleted', async () => {
		const loggedUser = await api
			.post('/api/login')
			.send(userLogin)
			.expect('Content-Type', /application\/json/);

		const newBlog = {
			title: 'First class tests',
			author: 'Robert C. Martin',
			url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
			likes: 10,
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${loggedUser.body.token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtStart = await helper.blogsInDb();
		const recentBlogIndex = blogsAtStart.length - 1;
		const blogToDelete = blogsAtStart[recentBlogIndex];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `bearer ${loggedUser.body.token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();
		const titles = blogsAtEnd.map((r) => r.title);

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
		expect(titles).not.toContain(blogToDelete.title);
	});
});

describe('updating a blog', () => {
	test('a blog can have its likes updated', async () => {
		const blogUpdate = {
			likes: 10,
		};

		const blogsAtStart = await helper.blogsInDb();
		const lastBlogIndex = blogsAtStart.length - 1;
		const blogToUpdate = blogsAtStart[lastBlogIndex];

		await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogUpdate).expect(200);

		const blogsAtEnd = await helper.blogsInDb();
		const updatedBlogLikes = blogsAtEnd[lastBlogIndex].likes;

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
		expect(updatedBlogLikes).toBe(10);
	});
});

test('if a token is not provided', async () => {
	const newBlog = {
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
	};
	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(401)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});
afterAll(() => {
	mongoose.connection.close();
});
