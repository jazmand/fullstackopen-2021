import React, {useState, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';

import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const Togglable = React.forwardRef((props, ref) => {
	const [visible, setVisible] = useState(false);

	const hideWhenVisible = {display: visible ? 'none' : ''};
	const showWhenVisible = {display: visible ? '' : 'none'};

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	useImperativeHandle(ref, () => {
		return {
			toggleVisibility,
		};
	});

	const useStyles = makeStyles((theme) => ({
		spacing: {
			marginLeft: theme.spacing(1),
		},
	}));

	const classes = useStyles();

	return (
		<div>
			<div style={hideWhenVisible}>
				<Button
					className={classes.spacing}
					id='create-blog'
					type='submit'
					variant='contained'
					color='primary'
					onClick={toggleVisibility}
				>
					{props.buttonLabel}
				</Button>
			</div>
			<div style={showWhenVisible}>
				{props.children}
				<Button
					className={classes.spacing}
					variant='contained'
					color='primary'
					onClick={toggleVisibility}
				>
					Cancel
				</Button>
			</div>
		</div>
	);
});

Togglable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = 'Togglable';

export default Togglable;
