import React, {useState} from 'react';

const BlogForm = ({createBlog}) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const handleCreateBlog = (event) => {
		event.preventDefault();
		createBlog({
			title,
			author,
			url,
		});
		setTitle('');
		setAuthor('');
		setUrl('');
	};

	return (
		<div>
			<form onSubmit={handleCreateBlog}>
				<div>
					title:
					<input
						id='title'
						value={title}
						name='title'
						onChange={({target}) => setTitle(target.value)}
					/>
				</div>
				<div>
					author:
					<input
						id='author'
						value={author}
						name='author'
						onChange={({target}) => setAuthor(target.value)}
					/>
				</div>
				<div>
					url:
					<input
						id='url'
						value={url}
						name='url'
						onChange={({target}) => setUrl(target.value)}
					/>
				</div>
				<button id='create-blog' type='submit'>
					Create
				</button>
			</form>
		</div>
	);
};

export default BlogForm;
