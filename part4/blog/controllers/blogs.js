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

// With promises:

// blogsRouter.get('/', (request, response) => {
// 	Blog.find({}).then((blogs) => {
// 		response.json(blogs);
// 	});
// });

// blogsRouter.post('/', (request, response) => {
// 	const blog = new Blog(request.body);

// 	blog.save().then((result) => {
// 		response.status(201).json(result);
// 	});
// });

module.exports = blogsRouter;
