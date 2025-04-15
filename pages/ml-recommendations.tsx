"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import CityComparisonChart from "../components/CityComparisonChart";

export default function MLRecommendations() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMLRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/ml-recommendations/?${searchParams.toString()}`
        );
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
    <div className="container mx-auto p-6">
      <h1 className="text-h1 font-heading mb-4">ML-Based Recommended Cities</h1>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-body text-error">{error}</p>
      ) : cities.length === 0 ? (
        <p className="text-body">No matching cities found.</p>
      ) : (
        <>
          <ul className="list-none p-0 space-y-4">
            {cities.map((city, index) => (
              <li
                key={index}
                className="cursor-pointer mb-4 p-4 border border-subdued rounded-medium shadow-subtle hover:bg-accent/10"
                onClick={() => handleCityClick(city.city)}
              >
                <strong className="text-h3">
                  {city.city}, {city.country}
                </strong>
                <p className="text-body">Similarity Score: {city.similarity}</p>
                <p className="text-body">
                  Average Salary: ${city.average_salary}
                </p>
                <p className="text-body">Average Rent: ${city.average_rent}</p>
                <p className="text-body">Safety Index: {city.safety_index}</p>
                <p className="text-body">
                  Quality of Life: {city.quality_of_life_index}
                </p>
              </li>
            ))}
          </ul>
          <h2 className="text-h2 font-medium mt-8 mb-4">
            Compare City Metrics
          </h2>
          <div className="max-w-3xl mx-auto">
            <CityComparisonChart
              cities={cities.map((city) => ({
                name: city.city,
                average_salary: city.average_salary,
                average_rent: city.average_rent,
                quality_of_life_index: city.quality_of_life_index,
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
