import React, {useState, useEffect} from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

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

	const createBlog = async (blogObject) => {
		try {
			const response = await blogService.create(blogObject);
			setBlogs(blogs.concat(response));
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

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification message={message} />
				<form onSubmit={handleLogin}>
					<div>
						username
						<input
							type='text'
							value={username}
							name='Username'
							onChange={({target}) => setUsername(target.value)}
						/>
					</div>
					<div>
						password
						<input
							type='password'
							value={password}
							name='Password'
							onChange={({target}) => setPassword(target.value)}
						/>
					</div>
					<button type='submit'>login</button>
				</form>
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
			<BlogForm createBlog={createBlog} />
			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} />
			))}
		</div>
	);
};

export default App;
