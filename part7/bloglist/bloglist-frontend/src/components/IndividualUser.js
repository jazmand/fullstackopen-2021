import React from 'react';

import {Link, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const IndividualUser = ({blogs}) => {
	if (!blogs[0]) return <p>Loading...</p>;

	const useStyles = makeStyles((theme) => ({
		root: {
			'& > *': {
				margin: theme.spacing(1),
			},
		},
	}));
	const classes = useStyles();

	return (
		<div>
			<h2>{blogs[0].user.name}</h2>
			<Typography>Added blogs</Typography>
			<ul>
				{blogs.map((blog) => {
					return (
						<li key={blog.id} className={classes.root}>
							<Link href={`/blogs/${blog.id}`} underline='hover' variant='h6'>
								{blog.title}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default IndividualUser;
