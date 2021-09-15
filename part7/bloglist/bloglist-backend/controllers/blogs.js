const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});

	response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body;
	const token = request.token;
	const user = request.user;

	if (!token || !user.id) {
		return response.status(401).json({error: 'token missing or invalid'});
	}

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
	const blog = await Blog.findById(request.params.id);
	const user = request.user;

	if (blog.user.toString() !== user.id.toString()) {
		return response.status(401).json({
			error: 'blogs can only be deleted by the user who added the blog',
		});
	}
	await blog.remove();
	response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
	const id = request.params.id;
	const blog = {likes: request.body.likes};

	const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
		new: true,
	});
	response.json(updatedBlog);
	response.status(200).end();
});

blogsRouter.post('/:id/comments', async (request, response) => {
	const currentBlog = await Blog.findById(request.params.id);
	currentBlog.comments = currentBlog.comments.concat(request.body.comment);
	currentBlog.save();
	response.status(200).json(currentBlog);
});

module.exports = blogsRouter;
