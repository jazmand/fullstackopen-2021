const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body);

	if (!blog.title || !blog.url)
		return response.status(400).json({error: 'title or url missing'});

	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
		await Blog.findByIdAndRemove(request.params.id);
		response.status(204).end();
	} catch (exception) {
		next(exception);
	}
});

module.exports = blogsRouter;
