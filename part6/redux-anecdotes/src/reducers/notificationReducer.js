let timeoutID = undefined;

const notificationReducer = (state = null, action) => {
	switch (action.type) {
		case 'SHOW_NOTIFICATION': {
			return action.data.notification;
		}
		case 'HIDE_NOTIFICATION': {
			return action.data.notification;
		}
		default:
			return state;
	}
};

export const setNotification = (notification, time) => {
	return async (dispatch) => {
		dispatch({
			type: 'SHOW_NOTIFICATION',
			data: {
				notification,
			},
		});
		clearTimeout(timeoutID);
		timeoutID = setTimeout(
			() =>
				dispatch({
					type: 'HIDE_NOTIFICATION',
					data: {
						notification: null,
					},
				}),
			time * 1000
		);
	};
};

export default notificationReducer;
