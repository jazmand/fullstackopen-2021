import React, { useState, useEffect } from "react";
import axios from "axios";

const Country = ({ country }) => {
	const [weather, setWeather] = useState([]);

	useEffect(() => {
		const api_key = process.env.REACT_APP_API_KEY;
		axios
			.get(
				`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`
			)
			.then((response) => {
				setWeather(response.data.current);
			});
	}, [country.capital]);
	console.log("render", weather);

	return (
		<>
			<h1>{country.name}</h1>
			<p>capital: {country.capital}</p>
			<p>population: {country.population}</p>
			<h2>Spoken languages</h2>
			<ul>
				{country.languages.map((language) => (
					<li key={language.name}>{language.name}</li>
				))}
			</ul>
			<img src={country.flag} alt="country flag" width="120" height="120" />
			<h2>Weather in {country.capital}</h2>
			<p>
				<b>temperature:</b> {weather.temperature} Celsius
			</p>
			<img
				src={weather.weather_icons}
				alt="weather icon"
				width="80"
				height="80"
			/>
			<p>
				<b>wind:</b> {weather.wind_speed} mph direction {weather.wind_dir}
			</p>
		</>
	);
};

export default Country;
