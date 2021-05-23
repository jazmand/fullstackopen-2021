import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import Countries from "./components/Countries";

function App() {
	const [countries, setCountries] = useState([]);
	const [filterCountry, setFilterCountry] = useState("");

	useEffect(() => {
		console.log("effect");
		axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
			console.log("promise fulfilled");
			setCountries(response.data);
		});
	}, []);
	console.log("render", countries.length, "countries");

	const handleFilterChange = (event) => {
		console.log(event.target.value);
		setFilterCountry(event.target.value);
	};
	return (
		<div>
			<Filter
				filterCountry={filterCountry}
				handleFilterChange={handleFilterChange}
			/>
			<Countries countries={countries} filterCountry={filterCountry} />
		</div>
	);
}

export default App;
