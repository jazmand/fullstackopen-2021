const _ = require('lodash');

const dummy = (blogs) => blogs.length + 1;

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => sum + blog.likes;

	return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const mostLikedBlog = blogs.reduce((a, b) => (a.likes >= b.likes ? a : b));
	return blogs.length === 0
		? 0
		: (({author, title, likes}) => ({author, title, likes}))(mostLikedBlog);
};

const mostBlogs = (blogs) => {
	const blogsPerAuthor = _.countBy(blogs, 'author');
	const mostBlogs = Object.entries(blogsPerAuthor).reduce((a, b) =>
		a[1] >= b[1] ? a : b
	);
	return blogs.length === 0 ? 0 : {author: mostBlogs[0], blogs: mostBlogs[1]};
};

const mostLikes = (blogs) => {
	const likesPerAuthor = _.chain(blogs)
		.groupBy('author')
		.mapValues(totalLikes)
		.value();
	const mostLikes = Object.entries(likesPerAuthor).reduce((a, b) =>
		a[1] >= b[1] ? a : b
	);
	return blogs.length === 0 ? 0 : {author: mostLikes[0], likes: mostLikes[1]};
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
