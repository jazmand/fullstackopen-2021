import React from 'react';
import {Typography} from '@material-ui/core';

const Notification = ({message}) => {
	if (message === null) {
		return null;
	}

	return (
		<Typography className={`message message-${message.type}`}>
			{message.text}
		</Typography>
	);
};

export default Notification;
