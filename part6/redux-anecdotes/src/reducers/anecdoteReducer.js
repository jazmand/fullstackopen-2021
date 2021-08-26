const getId = () => (100000 * Math.random()).toFixed(0);

const anecdoteReducer = (state = [], action) => {
	switch (action.type) {
		case 'VOTE_ANECDOTE': {
			return state.map((anecdote) =>
				anecdote.id === action.data
					? {...anecdote, votes: anecdote.votes + 1}
					: anecdote
			);
		}
		case 'NEW_ANECDOTE': {
			console.log('state now: ', state);
			console.log('action', action);
			return state.concat(action.data);
		}
		case 'INIT_ANECDOTES':
			return action.data;
		default:
			return state;
	}
};

export const voteAnecdote = (id) => {
	return {
		type: 'VOTE_ANECDOTE',
		data: id,
	};
};

export const createAnecdote = (content) => {
	return {
		type: 'NEW_ANECDOTE',
		data: {
			content,
			votes: 0,
			id: getId(),
		},
	};
};

export const initializeAnecdotes = (anecdotes) => {
	return {
		type: 'INIT_ANECDOTES',
		data: anecdotes,
	};
};

export default anecdoteReducer;
