import React, {useState} from 'react';

const Blog = ({blog, handleLikes, handleRemove, user}) => {
	const [showFull, setShowFull] = useState(false);

	const removeButtonStyle = {
		backgroundColor: 'cornflowerblue',
	};

	const showRemoveButton = () => {
		return (
			<div>
				<button style={removeButtonStyle} onClick={() => handleRemove(blog)}>
					remove
				</button>
			</div>
		);
	};

	const showFullBlog = () => {
		return (
			<div>
				<div>{blog.url}</div>
				<div>
					{`likes ${blog.likes}`}
					<button onClick={() => handleLikes(blog.id, blog.likes)}>like</button>
				</div>
				<div>{blog.author}</div>
				{blog['user'].username === user.username && showRemoveButton()}
			</div>
		);
	};

	const blogStyle = {
		paddingTop: '10px',
		paddingLeft: '2px',
		border: 'solid',
		borderWidth: '1px',
		marginBottom: '5px',
	};

	return (
		<div style={blogStyle}>
			<div>
				{blog.title}
				<button onClick={() => setShowFull(!showFull)}>
					{showFull ? 'hide' : 'view'}
				</button>
			</div>
			{showFull && showFullBlog()}
		</div>
	);
};

export default Blog;
