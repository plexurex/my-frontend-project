"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const UserRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/get-user-recommendations/"
        );
        if (!res.ok) {
          throw new Error(`Error fetching user recommendations: ${res.status}`);
        }
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Failed to fetch user recommendations:", err);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-h1 font-heading mb-6">
        Recommendations from Users
      </h1>
      {loading ? (
        <p className="text-body">Loading recommendations...</p>
      ) : error ? (
        <p className="text-body text-error">{error}</p>
      ) : recommendations.length === 0 ? (
        <p className="text-body">No recommendations found.</p>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-center border-b border-subdued pb-6"
            >
              {/* Left section - Location details */}
              <div className="flex-1">
                <h2 className="text-h3 font-semibold">
                  {rec.city_name}, {rec.country_name}
                </h2>
                <p className="text-body">Safety: {rec.safety_rating}/5</p>
                <p className="text-body">
                  Food Price: {rec.food_price_rating}/5
                </p>
                <p className="text-body">
                  Culture &amp; Entertainment: {rec.culture_rating}/5
                </p>
              </div>

              {/* Right section - User profile */}
              <div className="flex flex-col items-center ml-6">
                {/* <img
                  src={rec.user_image || "/default-avatar.png"}
                  alt={rec.user_name}
                  className="w-24 h-24 rounded-full shadow-subtle mb-2"
                /> */}
                <p className="text-body">{rec.user_name}</p>
                <div className="space-x-4 mt-2">
                  <Link
                    href={`/user-review/${rec.id}`}
                    className="text-primary hover:underline"
                  >
                    Read Review
                  </Link>
                  <Link
                    href={`/city-details/${encodeURIComponent(rec.city_name)}`}
                    className="text-primary hover:underline"
                  >
                    View City
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRecommendations;
