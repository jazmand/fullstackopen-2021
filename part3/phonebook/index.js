require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.use(express.json());

app.use(express.static("build"));

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response) => {
	Person.findById(request.params.id).then((person) => {
		response.json(person);
	});
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

app.post("/api/persons", (request, response) => {
	const body = request.body;
	// const findName = persons.find((n) => n.name === body.name);

	// if (!body.number) {
	// 	return response.status(400).json({
	// 		error: "number missing",
	// 	});
	// } else if (!body.name) {
	// 	return response.status(400).json({
	// 		error: "name missing",
	// 	});
	// } else if (Person.find(body.name)) {
	// 	return response.status(400).json({
	// 		error: "name already exists",
	// 	});
	// }

	const person = new Person({
		name: body.name,
		number: body.number,
		// id: generateId(),
	});
	person.save().then((savedPerson) => {
		response.json(savedPerson);
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
