import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import Countries from "./components/Countries";
import Country from "./components/Country";

function App() {
	const [countries, setCountries] = useState([]);
	const [filterCountry, setFilterCountry] = useState("");
	const [showCountry, setShowCountry] = useState(false);

	useEffect(() => {
		axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
			setCountries(response.data);
		});
	}, []);
	console.log("render", countries.length, "countries");

	const handleShowCountry = (country) => {
		setShowCountry(country);
	};

	const handleFilterChange = (event) => {
		setFilterCountry(event.target.value);
		setShowCountry(true);
	};
	return (
		<div>
			<Filter
				filterCountry={filterCountry}
				handleFilterChange={handleFilterChange}
			/>
			<Countries
				countries={countries}
				filterCountry={filterCountry}
				handleShowCountry={handleShowCountry}
			/>
			<div>{showCountry.name && <Country country={showCountry} />}</div>
		</div>
	);
}

export default App;
