const express = require("express");
const app = express();

let persons = [
	{
		name: "Arto Hellas",
		number: "040-123456",
		id: 1,
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2,
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3,
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4,
	},
];

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);
	response.json(person);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/info", (request, response) => {
	const people = persons.length;
	const today = new Date();
	const options = {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		timeZoneName: "short",
		hour12: false,
	};
	const date = new Intl.DateTimeFormat("en-US", options)
		.format(today)
		.replace(/,/g, "");
	function getTimeZoneName(today, locales, type) {
		return new Intl.DateTimeFormat(locales, { timeZoneName: type })
			.formatToParts(today)
			.find((part) => part.type == "timeZoneName").value;
	}
	const timezone = getTimeZoneName(today, [], "long");
	response.send(
		`<p>Phonebook has info for ${people} people</p>
        <p>${date} (${timezone})</p>`
	);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
