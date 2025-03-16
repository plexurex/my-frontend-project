"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CityDisplay() {
    const router = useRouter();
    const { country } = router.query;
    const [cities, setCities] = useState([]);
    const [salary, setSalary] = useState<number | null>(null);

    useEffect(() => {
        if (country) {
            // Fetch country details
            fetch("http://127.0.0.1:8000/api/countries/")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP status ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    const selectedCountry = data.find((c: any) => c.name === country);
                    if (selectedCountry) {
                        setSalary(selectedCountry.average_salary);
                    }
                })
                .catch((err) => console.error("Failed to fetch country details", err));

            // ✅ Fetch cities using the correct new API endpoint
            fetch(`http://127.0.0.1:8000/api/countries/${encodeURIComponent(country)}/cities/`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP status ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data.cities) {
                        setCities(data.cities);
                    } else {
                        setCities([]);
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch cities:", err);
                    setCities([]);
                });
        }
    }, [country]);

    return (
        <div>
            <h1>Cities in {country}</h1>
            {salary !== null && <h2>Average Salary: ${salary}</h2>}
            <ul>
                {cities.length > 0 ? (
                    cities.map((city) => (
                        <li key={city.id}>
                            <Link href={`/city-details/${encodeURIComponent(city.name)}`}>
                                {city.name} (Population: {city.population})
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No cities found.</p>
                )}
            </ul>
        </div>
    );
}
