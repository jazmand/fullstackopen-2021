import React from 'react';
import Togglable from './Togglable';

const Blog = ({blog}) => {
	const blogStyle = {
		paddingTop: '10px',
		paddingLeft: '2px',
		border: 'solid',
		borderWidth: '1px',
		marginBottom: '5px',
	};
	return (
		<div style={blogStyle}>
			{blog.title}
			<Togglable buttonLabel='view'>
				<div>{blog.url}</div>
				<div>
					{`likes ${blog.likes}`} <button>like</button>
				</div>
				<div>{blog.author}</div>
			</Togglable>
		</div>
	);
};

export default Blog;
