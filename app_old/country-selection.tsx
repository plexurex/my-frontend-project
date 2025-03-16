// app/country-selection.tsx
"use client"
import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';

const CountrySelection = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    useEffect(() => {
        fetch('/countries.json')
            .then(response => response.json())
            .then(data => {
                setCountries(Object.keys(data).map(key => ({ name: key })));
            })
            .catch(error => console.error('Failed to load countries', error));
    }, []);

    return (
        <div>
            <h1>Select a Country</h1>
            <select onChange={e => setSelectedCountry(e.target.value)} value={selectedCountry}>
                <option value="">Select a Country</option>
                {countries.map((country, index) => (
                    <option key={index} value={country.name}>{country.name}</option>
                ))}
            </select>
            {selectedCountry && (
                <Link href={`/cities/${selectedCountry}`}>
                    <a><button>See Cities</button></a>
                </Link>
            )}
        </div>
    );
};

export default CountrySelection;
