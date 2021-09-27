import blogService from '../services/blogs';
import {setFulfilledMessage, setErrorMessage} from './notificationReducer';

const blogReducer = (state = [], action) => {
	switch (action.type) {
		case 'INIT_BLOGS': {
			return action.data;
		}
		case 'CREATE_BLOG': {
			return [...state, action.data];
		}
		case 'LIKE_BLOG': {
			return state.map((blog) =>
				blog.id === action.data.id ? {...blog, likes: action.data.likes} : blog
			);
		}
		case 'DELETE_BLOG': {
			return state.filter((blog) => blog.id !== action.data.id);
		}
		case 'COMMENT_BLOG': {
			return state.map((comment) =>
				comment.id !== action.data.id ? comment : action.data
			);
		}
		default: {
			return state;
		}
	}
};

export const initBlogs = () => {
	return async (dispatch) => {
		const blogs = await blogService.getAll();
		dispatch({
			type: 'INIT_BLOGS',
			data: blogs,
		});
	};
};

export const createBlog = (blogObject) => {
	return async (dispatch) => {
		try {
			const newBlog = await blogService.create(blogObject);
			dispatch({
				type: 'CREATE_BLOG',
				data: newBlog,
			});
			dispatch(
				setFulfilledMessage(
					`a new blog ${blogObject.title} by ${blogObject.author} added`
				)
			);
		} catch (exception) {
			dispatch(setErrorMessage('All fields must be filled in'));
		}
	};
};

export const likeBlog = (id, likes) => {
	return async (dispatch) => {
		await blogService.update({
			id,
			likes,
		});

		dispatch({
			type: 'LIKE_BLOG',
			data: {
				id,
				likes,
			},
		});
	};
};

export const deleteBlog = (id) => {
	return async (dispatch) => {
		await blogService.remove({
			id,
		});
		dispatch({
			type: 'DELETE_BLOG',
			data: {
				id,
			},
		});
	};
};

export const addComment = (id, comment) => {
	return async (dispatch) => {
		const updatedBlog = await blogService.newComment(id, comment);
		dispatch({
			type: 'COMMENT_BLOG',
			data: updatedBlog,
		});
	};
};

export default blogReducer;
