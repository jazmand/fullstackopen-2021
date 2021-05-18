import React, { useState } from "react";

const FeedbackHeader = () => <h1> give feedback </h1>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticsHeader = () => <h1> statistics </h1>;

const Statistic = ({ text, value }) => (
	<tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
);

const Statistics = ({ good, neutral, bad }) => {
	let all = good + neutral + bad;
	let average = (good + 0 + -bad) / all;
	let positive = (good / all) * 100;
	if (all === 0) {
		return (
			<>
				<p>No feedback given</p>
			</>
		);
	}
	return (
		<table>
			<tbody>
				<Statistic text="good" value={good} />
				<Statistic text="neutral" value={neutral} />
				<Statistic text="bad" value={bad} />
				<Statistic text="all" value={all} />
				<Statistic text="average" value={average} />
				<Statistic text="positive" value={positive + " %"} />
			</tbody>
		</table>
	);
};

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	// set values
	const setGoodToValue = () => {
		setGood(good + 1);
	};
	const setNeutralToValue = () => {
		setNeutral(neutral + 1);
	};
	const setBadToValue = () => {
		setBad(bad + 1);
	};

	return (
		<div>
			<FeedbackHeader />
			<Button onClick={setGoodToValue} text="good" />
			<Button onClick={setNeutralToValue} text="neutral" />
			<Button onClick={setBadToValue} text="bad" />
			<StatisticsHeader />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
};

export default App;
