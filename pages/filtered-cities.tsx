// pages/filtered-cities.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const FilteredCities = () => {
    const router = useRouter();
    const [cities, setCities] = useState([]);
    const { rent, salary, amenities } = router.query;

    useEffect(() => {
        if (rent && salary && amenities) {
            const params = new URLSearchParams({
                rent: rent.toString(),
                salary: salary.toString(),
                amenities: Array.isArray(amenities) ? amenities.join(',') : amenities,
            });

            fetch(`http://127.0.0.1:8000/api/filter-cities/?${params.toString()}`)
                .then((res) => res.json())
                .then((data) => setCities(data))
                .catch((err) => console.error("Failed to fetch filtered cities", err));
        }
    }, [rent, salary, amenities]);

    return (
        <div>
            <h1>Recommended Cities</h1>
            <ul>
                {cities.length > 0 ? (
                    cities.map((city, index) => (
                        <li key={index}>
                            {city.name} - Rent: {city.rent} USD, Salary: {city.salary} USD
                        </li>
                    ))
                ) : (
                    <p>No cities match your preferences.</p>
                )}
            </ul>
        </div>
    );
};

export default FilteredCities;
