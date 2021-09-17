import React, {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Link, useRouteMatch} from 'react-router-dom';

import {withStyles, makeStyles} from '@material-ui/core/styles';
import {
	Container,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper,
} from '@material-ui/core';

import {initBlogs, createBlog} from './reducers/blogReducer';
import {loginUser} from './reducers/userReducer';

import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Users from './components/Users';
import IndividualUser from './components/IndividualUser';
import Navigation from './components/Navigation';

const App = () => {
	const dispatch = useDispatch();
	const blogs = useSelector((state) => state.blogs);
	const message = useSelector((state) => state.notification);
	const user = useSelector((state) => state.user);
	const blogFormRef = useRef();

	useEffect(() => {
		dispatch(loginUser());
	}, [dispatch]);

	useEffect(() => {
		dispatch(initBlogs());
	}, [dispatch]);

	const addBlog = (blogObject) => {
		blogFormRef.current.toggleVisibility();
		dispatch(createBlog(blogObject));
	};

	const matchUserId = useRouteMatch('/users/:id');
	const userBlogs = matchUserId
		? blogs.filter((blog) => blog.user.id === matchUserId.params.id)
		: null;

	const matchBlogId = useRouteMatch('/blogs/:id');
	const currentBlog = matchBlogId
		? blogs.find((blog) => blog.id === matchBlogId.params.id)
		: null;

	const StyledTableCell = withStyles((theme) => ({
		head: {
			backgroundColor: theme.palette.warning.light,
			color: theme.palette.common.white,
		},
		body: {
			fontSize: 14,
		},
	}))(TableCell);

	const StyledTableRow = withStyles((theme) => ({
		root: {
			'&:nth-of-type(odd)': {
				backgroundColor: theme.palette.action.hover,
			},
		},
	}))(TableRow);

	const useStyles = makeStyles({
		table: {
			minWidth: 700,
		},
	});

	const classes = useStyles();

	return (
		<Container maxWidth='xl'>
			<Navigation />
			<Notification message={message} />
			<Switch>
				<Route path='/users/:id'>
					<IndividualUser blogs={userBlogs} />
				</Route>
				<Route path='/blogs/:id'>
					<Blog blog={currentBlog} />
				</Route>
				<Route path='/users'>{user === null ? <LoginForm /> : <Users />}</Route>
				<Route path='/'>
					{user === null ? (
						<div>
							<LoginForm />
						</div>
					) : (
						<div>
							<h2>Blogs</h2>
							<Togglable buttonLabel='Create Blog' ref={blogFormRef}>
								<BlogForm createBlog={addBlog} />
							</Togglable>
							<TableContainer component={Paper}>
								<Table className={classes.table} aria-label='customized table'>
									<TableBody>
										{blogs
											.sort((a, b) => (a.likes > b.likes ? -1 : 1))
											.map((blog) => (
												<StyledTableRow key={blog.id}>
													<StyledTableCell component='th' scope='row'>
														<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
													</StyledTableCell>
												</StyledTableRow>
											))}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					)}
				</Route>
			</Switch>
		</Container>
	);
};

export default App;
