import React from "react";

const Persons = ({ persons, filterName, deletePerson }) => {
	return (
		<div>
			{persons
				.filter((person) =>
					person.name.toLowerCase().includes(filterName.toLowerCase())
				)
				.map((person) => (
					<p key={person.id}>
						{person.name} {person.number}
						<button
							onClick={() =>
								window.confirm(`Delete ${person.name}?`)
									? deletePerson(person.id)
									: console.log("delete cancelled")
							}
						>
							delete
						</button>
					</p>
				))}
		</div>
	);
};

export default Persons;
