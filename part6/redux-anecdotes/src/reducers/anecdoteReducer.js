import anecdoteService from '../services/anecdotes';

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
	return async (dispatch) => {
		const newAnecdote = await anecdoteService.createNew(content);
		dispatch({type: 'NEW_ANECDOTE', data: newAnecdote});
	};
};

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		dispatch({
			type: 'INIT_ANECDOTES',
			data: anecdotes,
		});
	};
};

export default anecdoteReducer;
