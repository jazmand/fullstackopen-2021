import React, { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
	const anecdotes = [
		"If it hurts, do it more often",
		"Adding manpower to a late software project makes it later!",
		"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
		"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
		"Premature optimization is the root of all evil.",
		"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
	];

	const [selected, setSelected] = useState(0);
	const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

	// select random anecdote
	const setSelectedAnecdote = () => {
		let selected = Math.floor(Math.random() * anecdotes.length);
		setSelected(selected);
	};

	// set votes value
	const setVoteValue = () => {
		const vote = [...votes];
		vote[selected] += 1;
		setVotes(vote);
	};

	// find anecdote with most votes
	let mostVotes = votes.indexOf(Math.max(...votes));

	return (
		<>
			<h1>Anecdote of the day</h1>
			<div>{anecdotes[selected]}</div>
			<div>has {votes[selected]} votes</div>
			<Button onClick={setVoteValue} text="vote" />
			<Button onClick={setSelectedAnecdote} text="next anecdote" />
			<h1>Anecdote with most votes</h1>
			<div>{anecdotes[mostVotes]}</div>
			<div>has {votes[mostVotes]} votes</div>
		</>
	);
};

export default App;
