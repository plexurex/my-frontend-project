// pages/ml-recommendations.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import CityComparisonChart from "../components/CityComparisonChart";

export default function MLRecommendations() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMLRecommendations = async () => {
            setLoading(true);
            setError("");

            try {
                // Use the full URL to call your Django ML endpoint
                const res = await fetch(`http://127.0.0.1:8000/api/ml-recommendations/?${searchParams.toString()}`);
                if (!res.ok) {
                    throw new Error(`Error fetching ML recommendations: ${res.status}`);
                }
                const data = await res.json();
                setCities(data.recommended_cities || []);
            } catch (err) {
                console.error("Failed to fetch ML recommendations:", err);
                setError("Failed to fetch ML recommendations. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMLRecommendations();
    }, [searchParams]);

    const handleCityClick = (cityName: string) => {
        router.push(`/city-details/${encodeURIComponent(cityName)}`);
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h1>ML-Based Recommended Cities</h1>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : cities.length === 0 ? (
                <p>No matching cities found.</p>
            ) : (
                <>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {cities.map((city, index) => (
                            <li
                                key={index}
                                style={{ cursor: "pointer", marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc" }}
                                onClick={() => handleCityClick(city.city)}
                            >
                                <strong>{city.city}, {city.country}</strong>
                                <p>Similarity Score: {city.similarity}</p>
                                <p>Average Salary: ${city.average_salary}</p>
                                <p>Average Rent: ${city.average_rent}</p>
                                <p>Safety Index: {city.safety_index}</p>
                                <p>Quality of Life: {city.quality_of_life_index}</p>
                            </li>
                        ))}
                    </ul>
                    <h2>Compare City Metrics</h2>
                    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <CityComparisonChart
                            cities={cities.map(city => ({
                                name: city.city,
                                average_salary: city.average_salary,
                                average_rent: city.average_rent,
                                quality_of_life_index: city.quality_of_life_index
                            }))}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
