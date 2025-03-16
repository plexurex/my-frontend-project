// components/CityList.js
import React from 'react';

function CityList({ selectedCountry, cities }) {
    return (
        <div>
            <h2>Cities in {selectedCountry}</h2>
            <ul>
                {cities.map((city, index) => (
                    <li key={index}>{city}</li>
                ))}
            </ul>
        </div>
    );
}

export default CityList;
