import React, {useState} from 'react';

const Blog = ({blog}) => {
	const [showFull, setShowFull] = useState(false);

	const showFullBlog = () => {
		return (
			<div>
				<div>{blog.url}</div>
				<div>
					{`likes ${blog.likes}`}
					<button>like</button>
				</div>
				<div>{blog.author}</div>
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
