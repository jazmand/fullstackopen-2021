import React from "react";

const Country = ({ country }) => {
	return (
		<div>
			<h1>{country.name}</h1>
			<p>capital: {country.capital}</p>
			<p>population: {country.population}</p>
			<h1>languages</h1>
			<ul>
				{country.languages.map((language) => (
					<li key={language.name}>{language.name}</li>
				))}
			</ul>
			<img src={country.flag} alt="country flag" width="120" height="120" />
		</div>
	);
};

export default Country;
