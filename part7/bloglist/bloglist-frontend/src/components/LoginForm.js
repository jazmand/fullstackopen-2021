import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {userLogin} from '../reducers/userReducer';

import {makeStyles} from '@material-ui/core/styles';
import {TextField, Button} from '@material-ui/core';

const LoginForm = () => {
	const dispatch = useDispatch();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(userLogin(username, password));
		setUsername('');
		setPassword('');
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
		<div>
			<form onSubmit={handleSubmit} className={classes.root}>
				<div>
					<TextField
						label='Username'
						variant='outlined'
						id='username'
						value={username}
						onChange={({target}) => setUsername(target.value)}
					/>
				</div>
				<div>
					<TextField
						label='Password'
						variant='outlined'
						id='password'
						type='password'
						value={password}
						onChange={({target}) => setPassword(target.value)}
					/>
				</div>
				<Button
					id='login-button'
					type='submit'
					variant='contained'
					color='primary'
				>
					Login
				</Button>
			</form>
		</div>
	);
};

export default LoginForm;
