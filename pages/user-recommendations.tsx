"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const UserRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetch("http://127.0.0.1:8000/api/get-user-recommendations/");
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
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Recommendations from Users</h1>
            {loading ? (
                <p>Loading recommendations...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : recommendations.length === 0 ? (
                <p>No recommendations found.</p>
            ) : (
                <div className="space-y-6">
                    {recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center border-b pb-6">
                            {/* Left section - Location details */}
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold">
                                    {rec.city_name}, {rec.country_name}
                                </h2>
                                <p>Safety: {rec.safety_rating}/5</p>
                                <p>Food Price: {rec.food_price_rating}/5</p>
                                <p>Culture & Entertainment: {rec.culture_rating}/5</p>
                            </div>

                            {/* Right section - User profile */}
                            <div className="flex flex-col items-center ml-6">
                                <img
                                    src={rec.user_image || "/default-avatar.png"}  // Fallback image if no user image is provided
                                    alt={rec.user_name}
                                    className="w-24 h-24 rounded-full mb-2"
                                />
                                <p>{rec.user_name}</p>
                                <div className="space-x-4 mt-2">
                                    {/* 
                                        UPDATED: 
                                        Use rec.id for the user-review link 
                                        and rec.city_name for the city-details link 
                                    */}
                                    <Link 
                                        href={`/user-review/${rec.id}`} 
                                        className="text-blue-600"
                                    >
                                        Read Review
                                    </Link>
                                    <Link 
                                        href={`/city-details/${encodeURIComponent(rec.city_name)}`} 
                                        className="text-blue-600"
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
