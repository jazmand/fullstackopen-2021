const notificationReducer = (state = null, action) => {
	switch (action.type) {
		case 'SET_MESSAGE': {
			return action.data;
		}
		case 'REMOVE_MESSAGE': {
			return null;
		}
		default: {
			return state;
		}
	}
};

const removeMessage = (dispatch) => {
	setTimeout(() => {
		dispatch({
			type: 'REMOVE_MESSAGE',
		});
	}, 5000);
};

export const setFulfilledMessage = (message) => {
	return async (dispatch) => {
		dispatch({
			type: 'SET_MESSAGE',
			data: {
				text: message,
				type: 'fulfilled',
			},
		});
		removeMessage(dispatch);
	};
};

export const setErrorMessage = (message) => {
	return async (dispatch) => {
		dispatch({
			type: 'SET_MESSAGE',
			data: {
				text: message,
				type: 'error',
			},
		});
		removeMessage(dispatch);
	};
};

export default notificationReducer;
