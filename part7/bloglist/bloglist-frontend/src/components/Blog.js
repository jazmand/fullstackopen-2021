import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {likeBlog, deleteBlog, addComment} from '../reducers/blogReducer';
import {
	setFulfilledMessage,
	setErrorMessage,
} from '../reducers/notificationReducer';
import blogService from '../services/blogs';

const Blog = ({blog}) => {
	if (!blog) return <p>Loading...</p>;

	const dispatch = useDispatch();
	const history = useHistory();
	const [allowRemove, setAllowRemove] = useState(false);

	useEffect(() => {
		const user = blogService.getUserInfo();
		const blogUser = blog.user.id || blog.user;
		setAllowRemove(blogUser === user.id);
	}, []);

	const addLike = () => {
		try {
			dispatch(likeBlog(blog.id, blog.likes + 1));
			dispatch(
				setFulfilledMessage(`new like to blog ${blog.title} by ${blog.author}`)
			);
		} catch (error) {
			dispatch(setErrorMessage(error));
		}
	};

	const removeBlog = () => {
		const result = window.confirm(`Remove ${blog.title} by ${blog.author}?`);
		if (result) {
			try {
				dispatch(
					setFulfilledMessage(`blog ${blog.title} by ${blog.author} delete`)
				);
				dispatch(deleteBlog(blog.id));
				history.push('/');
			} catch (error) {
				dispatch(setErrorMessage(error));
			}
		}
	};

	const createComment = (e) => {
		e.preventDefault();
		dispatch(addComment(blog.id, e.target.comment.value));
		e.target.comment.value = '';
	};

	return (
		<div>
			<h1 className='title'>{blog.title}</h1>
			<div className='info'>
				<a href={blog.id}>{blog.url}</a>
				<p>
					<span className='likes'>{blog.likes} likes</span>
					<button className='like' onClick={addLike}>
						like
					</button>
				</p>
				<p className='author'>added by {blog.author}</p>
				{allowRemove && (
					<button className='remove' onClick={removeBlog}>
						remove
					</button>
				)}
			</div>
			<div className='comments'>
				<h3>Comments</h3>
				<form onSubmit={createComment}>
					<input type='text' name='comment' />
					<button type='submit'>add comment</button>
				</form>
				<ul>
					{blog.comments ? (
						blog.comments.map((comment) => <li key={comment.id}>{comment}</li>)
					) : (
						<div> No comments </div>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Blog;
