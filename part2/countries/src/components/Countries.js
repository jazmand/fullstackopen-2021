import React from "react";
import Country from "./Country";

const Countries = ({ countries, filterCountry, handleShowCountry }) => {
	let filteredCountries = countries.filter((country) =>
		country.name.toLowerCase().includes(filterCountry.toLowerCase())
	);
	if (filteredCountries.length > 10) {
		return "Too many matches, specify another filter";
	} else if (filteredCountries.length === 1) {
		return filteredCountries.map((country) => (
			<Country key={country.name} country={country} />
		));
	} else {
		return filteredCountries.map((country) => (
			<div key={country.name}>
				{country.name}
				<button onClick={() => handleShowCountry(country)}>show</button>
			</div>
		));
	}
};

export default Countries;
