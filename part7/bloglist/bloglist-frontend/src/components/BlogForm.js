import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import {TextField, Button} from '@material-ui/core';

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

	const useStyles = makeStyles((theme) => ({
		root: {
			'& > *': {
				margin: theme.spacing(1),
			},
		},
	}));
	const classes = useStyles();

	return (
		<div className='blogFormDiv'>
			<form onSubmit={handleCreateBlog} className={classes.root}>
				<div>
					<TextField
						label='Title'
						variant='outlined'
						id='title'
						value={title}
						name='title'
						onChange={({target}) => setTitle(target.value)}
					/>
				</div>
				<div>
					<TextField
						label='Author'
						variant='outlined'
						id='author'
						value={author}
						name='author'
						onChange={({target}) => setAuthor(target.value)}
					/>
				</div>
				<div>
					<TextField
						label='Url'
						variant='outlined'
						id='url'
						value={url}
						name='url'
						onChange={({target}) => setUrl(target.value)}
					/>
				</div>
				<Button
					id='create-blog'
					type='submit'
					variant='contained'
					color='primary'
				>
					Create
				</Button>
			</form>
		</div>
	);
};

export default BlogForm;
