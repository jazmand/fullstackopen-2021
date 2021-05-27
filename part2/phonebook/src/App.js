import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filterName, setFilterName] = useState("");

	useEffect(() => {
		console.log("effect");
		personService.getAll().then((initialPersons) => {
			console.log("promise fulfilled");
			setPersons(initialPersons);
		});
	}, []);
	console.log("render", persons.length, "persons");

	const deletePerson = (id) => {
		personService.deleteRequest(id).then(() => {
			setPersons(persons.filter((person) => person.id !== id));
			console.log("delete success", persons);
		});
	};

	const addPerson = (event) => {
		event.preventDefault();
		const personObject = {
			name: newName,
			number: newNumber,
		};
		personService.create(personObject).then((returnedPerson) => {
			if (persons.some((person) => person.name === newName)) {
				alert(`${newName} is already added to phonebook`);
			} else {
				setPersons(persons.concat(returnedPerson));
				setNewName("");
				setNewNumber("");
			}
		});
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