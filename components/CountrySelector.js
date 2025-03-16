// components/CountrySelector.js
import React from 'react';

function CountrySelector({ countries, selectedCountry, setSelectedCountry }) {
    return (
        <select onChange={e => setSelectedCountry(e.target.value)} value={selectedCountry}>
            <option value="">Select a Country</option>
            {countries.map((country, index) => (
                <option key={index} value={country.name}>{country.name}</option>
            ))}
        </select>
    );
}

export default CountrySelector;
