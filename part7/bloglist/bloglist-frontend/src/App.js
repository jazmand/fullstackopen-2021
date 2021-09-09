import React, {useState, useEffect, useRef} from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState(null);
	const [update, setUpdate] = useState(null);
	const blogFormRef = useRef();

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, [update]);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		console.log('logging in with', username, password);
		try {
			const user = await loginService.login({
				username,
				password,
			});
			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
			setMessage({
				text: 'Successfully logged in',
				type: 'fulfilled',
			});
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		} catch (exception) {
			setMessage({
				text: 'wrong username or password',
				type: 'error',
			});
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		}
	};

	const handleLogout = async () => {
		console.log('logging out');
		window.localStorage.removeItem('loggedNoteappUser');
		//window.localStorage.clear();
		setUser(null);
	};

	const addBlog = async (blogObject) => {
		try {
			blogFormRef.current.toggleVisibility();
			const response = await blogService.create(blogObject);
			setBlogs(blogs.concat(response));
			setUpdate(blogs);
			setMessage({
				text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
				type: 'fulfilled',
			});
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		} catch (exception) {
			setMessage({
				text: `${exception}`,
				type: 'error',
			});
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		}
	};

	const handleLikes = async (id, likes) => {
		await blogService.update({
			id: id,
			likes: likes + 1,
		});
		setUpdate(likes);
	};

	const handleRemove = async (blog) => {
		const result = window.confirm(`Remove ${blog.title} by ${blog.author}?`);
		result &&
			(await blogService.remove({
				id: blog.id,
			}));
		setUpdate(blogs);
	};

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification message={message} />
				<LoginForm
					handleSubmit={handleLogin}
					username={username}
					password={password}
					handleUsernameChange={({target}) => setUsername(target.value)}
					handlePasswordChange={({target}) => setPassword(target.value)}
				/>
			</div>
		);
	}
	return (
		<div>
			<h2>blogs</h2>
			<Notification message={message} />
			<div>
				{user.name} logged in
				<button onClick={handleLogout} type='button'>
					logout
				</button>
			</div>
			<br></br>

			<h2>create new</h2>
			<Togglable buttonLabel='new blog' ref={blogFormRef}>
				<BlogForm createBlog={addBlog} />
			</Togglable>
			{blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1)) &&
				blogs.map((blog) => (
					<Blog
						key={blog.id}
						blog={blog}
						handleLikes={handleLikes}
						handleRemove={handleRemove}
						user={user}
					/>
				))}
		</div>
	);
};

export default App;
