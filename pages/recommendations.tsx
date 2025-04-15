"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CityComparisonChart from "../components/CityComparisonChart";
import LoadingSpinner from "../components/LoadingSpinner";

const Recommendations = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ rating: 1, comment: "" });
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError("");

      try {
        // Using the full URL to reach your Django API
        const res = await fetch(
          `http://127.0.0.1:8000/api/recommend-cities/?${searchParams.toString()}`
        );
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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Replace this URL with the actual URL for submitting feedback
    const response = await fetch("http://127.0.0.1:8000/api/feedback/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: feedback.rating,
        comment: feedback.comment,
      }),
    });

    if (response.ok) {
      setIsFeedbackSubmitted(true);
      alert("Feedback submitted successfully!");
    } else {
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-h1 font-heading mb-4">Recommended Cities</h1>
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
                onClick={() => handleCityClick(city.name)}
              >
                <strong className="text-h3">
                  {city.name}, {city.country}
                </strong>
                <p className="text-body">Safety Index: {city.safety_index}</p>
                <p className="text-body">
                  Quality of Life: {city.quality_of_life_index}
                </p>
                <p className="text-body">
                  Average Salary: ${city.average_salary}
                </p>
                <p className="text-body">
                  Average Rent: ${city.average_rent}
                </p>
              </li>
            ))}
          </ul>
          <h2 className="text-h2 font-medium mt-8 mb-4 text-center">
            Compare City Metrics
          </h2>
          <div className="max-w-3xl mx-auto">
            <CityComparisonChart cities={cities} />
          </div>

          {/* Feedback Form */}
          {!isFeedbackSubmitted && (
            <div className="mt-8">
              <h2 className="text-h2 font-medium mb-4">Provide Feedback</h2>
              <form onSubmit={handleFeedbackSubmit}>
                <div>
                  <label className="block">Rating (1 to 5)</label>
                  <select
                    value={feedback.rating}
                    onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}
                    className="w-full border p-2 rounded"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block">Comment (Optional)</label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    className="w-full border p-2 rounded"
                    placeholder="Share your thoughts on the recommendation."
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          )}
          {isFeedbackSubmitted && (
            <div className="mt-8 text-center">
              <p>Thank you for your feedback!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Recommendations;
