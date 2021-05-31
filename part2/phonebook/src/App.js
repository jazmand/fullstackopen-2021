import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filterName, setFilterName] = useState("");
	const [message, setMessage] = useState(null);

	useEffect(() => {
		console.log("effect");
		personService.getAll().then((initialPersons) => {
			console.log("promise fulfilled");
			setPersons(initialPersons);
		});
	}, []);
	console.log("render", persons.length, "persons");

	const deletePerson = (id) => {
		const person = persons.find((n) => n.id === id);
		personService
			.deleteRequest(id)
			.then(() => {
				setPersons(persons.filter((person) => person.id !== id));
				setMessage({
					text: `${person.name} removed from server`,
					type: "fulfilled",
				});
				setTimeout(() => {
					setMessage(null);
				}, 4000);
			})
			.catch(() => {
				setMessage({
					text: `Information of ${person.name} already removed from server`,
					type: "error",
				});
				setTimeout(() => {
					setMessage(null);
				}, 4000);
			});
	};

	const updateNumber = (id, newObject) => {
		personService.update(id, newObject).then(() => {
			personService.getAll().then((updatedPersons) => {
				console.log("update fulfilled");
				setMessage({
					text: "phone number updated",
					type: "fulfilled",
				});
				setTimeout(() => {
					setMessage(null);
				}, 4000);
				setPersons(updatedPersons);
				setNewName("");
				setNewNumber("");
			});
		});
	};

	const addPerson = (event) => {
		event.preventDefault();
		const personObject = {
			name: newName,
			number: newNumber,
		};

		if (persons.some((person) => person.name === newName)) {
			window.confirm(
				`${newName} is already added to phonebook, replace the old number with a new one?`
			)
				? persons.map(
						(person) =>
							person.name === newName && updateNumber(person.id, personObject)
				  )
				: console.log("update cancelled");
		} else {
			personService.create(personObject).then((returnedPerson) => {
				setMessage({
					text: `Added ${newName}`,
					type: "fulfilled",
				});
				setTimeout(() => {
					setMessage(null);
				}, 4000);
				setPersons(persons.concat(returnedPerson));
				setNewName("");
				setNewNumber("");
			});
		}
	};

	const handleNameChange = (event) => {
		console.log(event.target.value);
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		console.log(event.target.value);
		setNewNumber(event.target.value);
	};

	const handleFilterChange = (event) => {
		console.log(event.target.value);
		setFilterName(event.target.value);
	};
	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} />
			<Filter filterName={filterName} handleFilterChange={handleFilterChange} />
			<h2>add a new</h2>
			<PersonForm
				addPerson={addPerson}
				newName={newName}
				handleNameChange={handleNameChange}
				newNumber={newNumber}
				handleNumberChange={handleNumberChange}
			/>
			<h2>Numbers</h2>
			<Persons
				deletePerson={deletePerson}
				persons={persons}
				filterName={filterName}
			/>
		</div>
	);
};

export default App;
