import React from "react";
import Country from "./Country";

const Countries = ({ countries, filterCountry }) => {
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
			<p key={country.name}>{country.name}</p>
		));
	}
};

export default Countries;
