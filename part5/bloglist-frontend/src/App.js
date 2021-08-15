import React, {useState, useEffect} from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);

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

		const user = await loginService.login({
			username,
			password,
		});

		window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
		blogService.setToken(user.token);
		setUser(user);
		setUsername('');
		setPassword('');
	};

	const handleLogout = async () => {
		console.log('logging out');
		window.localStorage.removeItem('loggedNoteappUser');
		//window.localStorage.clear();
		setUser(null);
	};

	const createBlog = async (blogObject) => {
		const response = await blogService.create(blogObject);
		setBlogs(blogs.concat(response));
	};

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
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