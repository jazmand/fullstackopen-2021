const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum + item.likes;
	};

	return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const findMostLikedBlog = (a, b) => {
		return a.likes >= b.likes ? a : b;
	};
	const mostLikedBlog = blogs.reduce(findMostLikedBlog);
	return blogs.length === 0
		? 0
		: (({author, title, likes}) => ({author, title, likes}))(mostLikedBlog);
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
};
