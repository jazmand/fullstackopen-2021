import React from "react";

const Filter = ({ filterCountry, handleFilterChange }) => {
	return (
		<div>
			find countries
			<input value={filterCountry} onChange={handleFilterChange} />
		</div>
	);
};

export default Filter;
