"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CityComparisonChart from "../components/CityComparisonChart";
import LoadingSpinner from "../components/LoadingSpinner";

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
                // Using the full URL to reach your Django API
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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Recommended Cities</h1>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : cities.length === 0 ? (
                <p>No matching cities found.</p>
            ) : (
                <>
                    <ul className="list-none p-0">
                        {cities.map((city, index) => (
                            <li
                                key={index}
                                className="cursor-pointer mb-4 p-2 border border-gray-300 hover:bg-gray-100 rounded"
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
                    <h2 className="text-xl font-semibold mt-8 mb-4 text-center">Compare City Metrics</h2>
                    <div className="max-w-3xl mx-auto">
                        <CityComparisonChart cities={cities} />
                    </div>
                </>
            )}
        </div>
    );
}
