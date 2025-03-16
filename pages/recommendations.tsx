"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Recommendations() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            setError("");

            try {
                // Using the full URL if necessary:
                const res = await fetch(`http://127.0.0.1:8000/api/recommend-cities/?${searchParams.toString()}`);
                if (!res.ok) {
                    throw new Error(`Error fetching recommendations: ${res.status}`);
                }
                const data = await res.json();
                setCities(data.recommended_cities || []);
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
                setError("Failed to fetch recommendations. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, [searchParams]);

    const handleCityClick = (cityName: string) => {
        // Navigate to the city details page using the city name.
        router.push(`/city-details/${encodeURIComponent(cityName)}`);
    };

    return (
        <div>
            <h1>Recommended Cities</h1>
            {loading ? (
                <p>Loading recommendations...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : cities.length === 0 ? (
                <p>No matching cities found.</p>
            ) : (
                <ul>
                    {cities.map((city, index) => (
                        <li
                            key={index}
                            style={{ cursor: "pointer", marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc" }}
                            onClick={() => handleCityClick(city.name)}
                        >
                            <strong>{city.name}, {city.country}</strong>
                            <p>Safety Index: {city.safety_index}</p>
                            <p>Quality of Life: {city.quality_of_life_index}</p>
                            <p>Average Salary: ${city.average_salary}</p>
                            <p>Average Rent: ${city.average_rent}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
