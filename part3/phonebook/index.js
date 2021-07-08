const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.use(express.json());

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
	person ? response.json(person) : response.status(404).end();
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

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

const generateId = () => {
	const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
	return maxId + 1;
};

app.post("/api/persons", (request, response) => {
	const body = request.body;
	const findName = persons.find((n) => n.name === body.name);

	if (!body.number) {
		return response.status(400).json({
			error: "number missing",
		});
	} else if (!body.name) {
		return response.status(400).json({
			error: "name missing",
		});
	} else if (findName) {
		return response.status(400).json({
			error: "name already exists",
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};
	persons = persons.concat(person);

	response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
