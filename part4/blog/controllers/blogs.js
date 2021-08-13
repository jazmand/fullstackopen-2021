const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});

	response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body;
	const decodedToken = jwt.verify(request.token, process.env.SECRET);

	if (!request.token || !decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid'});
	}
	const user = await User.findById(decodedToken.id);

	if (!body.title || !body.url)
		return response.status(400).json({error: 'title or url missing'});

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();
	response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response, next) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET);

	if (!request.token || !decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid'});
	}

	const userid = request.params.id;
	const blog = await Blog.findById(userid);
	console.log(`first: ${userid.toString()} second: ${blog.user.toString()}`);
	if (blog.user.toString() === userid.toString()) {
		await Blog.findByIdAndRemove(userId);
		response.status(204).end();
	}
	return response.status(401).json({
		error: 'Blogs can only be deleted by the user who added the blog',
	});
});

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body;
	const blog = {likes: body.likes};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});
	response.json(updatedBlog);
	response.status(200).end();
});

module.exports = blogsRouter;
