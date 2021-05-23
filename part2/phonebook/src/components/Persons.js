import React from "react";
import Person from "./Person";

const Persons = ({ persons, filterName }) => {
	return (
		<div>
			{persons
				.filter((person) =>
					person.name.toLowerCase().includes(filterName.toLowerCase())
				)
				.map((person) => (
					<Person key={person.name} person={person} />
				))}
		</div>
	);
};

export default Persons;
