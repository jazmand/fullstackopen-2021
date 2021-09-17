import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {userLogout} from '../reducers/userReducer';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core';

const Navigation = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const history = useHistory();

	const handleLogout = () => {
		dispatch(userLogout());
		history.push('/');
	};

	const useStyles = makeStyles((theme) => ({
		title: {
			flexGrow: 1,
		},
		logoutButton: {
			marginLeft: theme.spacing(2),
		},
		link: {
			textDecoration: 'none',
			color: '#fff',
			paddingRight: '1em',
		},
		loggedText: {
			color: 'grey',
		},
	}));

	const classes = useStyles();

	return (
		<div>
			<AppBar position='static'>
				<Toolbar>
					{user !== null ? (
						<>
							<Typography variant='h6' className={classes.title}>
								<Link className={classes.link} to='/blogs'>
									Blogs
								</Link>
								<Link className={classes.link} to='/users'>
									Users
								</Link>
							</Typography>
							<Typography variant='overline' className={classes.loggedText}>
								{user.name} logged in
							</Typography>
							<Button
								variant='outlined'
								color='secondary'
								className={classes.logoutButton}
								onClick={handleLogout}
							>
								Logout
							</Button>
						</>
					) : (
						<Typography variant='h5'>Login</Typography>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default Navigation;
