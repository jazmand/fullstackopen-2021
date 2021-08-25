import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {voteAnecdote} from '../reducers/anecdoteReducer';
import {
	showNotification,
	hideNotification,
} from '../reducers/notificationReducer';

const AnecdoteList = () => {
	const anecdotes = useSelector((state) => state.anecdotes);
	const dispatch = useDispatch();

	const vote = (anecdote) => {
		dispatch(voteAnecdote(anecdote.id));
		dispatch(showNotification(`you voted '${anecdote.content}'`));
		setTimeout(() => {
			dispatch(hideNotification());
		}, 5000);
	};

	return (
		<>
			{anecdotes.sort((a, b) => (a.votes > b.votes ? -1 : 1)) &&
				anecdotes.map((anecdote) => (
					<div key={anecdote.id}>
						<div>{anecdote.content}</div>
						<div>
							has {anecdote.votes}
							<button onClick={() => vote(anecdote)}>vote</button>
						</div>
					</div>
				))}
		</>
	);
};

export default AnecdoteList;
