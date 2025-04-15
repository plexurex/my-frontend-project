"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Recommendation {
  id: number;
  country_name: string;
  city_name: string;
  safety_rating: number;
  food_price_rating: number;
  culture_rating: number;
  affordability_rating: number;
  accessibility_rating: number;
  quality_of_life_rating: number;
  user_name: string;
  user_image: string | null;
}

const UserReview = () => {
  const router = useRouter();
  const { id } = router.query;
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchRecommendation = async () => {
      setLoading(true);
      setError("");
      try {
        // Ensure your backend has this endpoint to fetch a single recommendation by id.
        const res = await fetch(`http://127.0.0.1:8000/api/user-recommendations/${id}/`);
        if (!res.ok) {
          throw new Error(`Error fetching recommendation: ${res.status}`);
        }
        const data = await res.json();
        setRecommendation(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch recommendation.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [id]);

  if (loading)
    return <p className="text-body text-center">Loading recommendation details...</p>;
  if (error)
    return <p className="text-body text-error text-center">{error}</p>;
  if (!recommendation)
    return <p className="text-body text-center">No recommendation found.</p>;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-surface p-6 rounded-medium shadow-medium">
        <h1 className="text-h1 font-heading mb-4">
          Recommendation for {recommendation.city_name}, {recommendation.country_name}
        </h1>
        <div className="mb-4 flex items-center space-x-4">
          <p className="text-body">
            <strong>User:</strong> {recommendation.user_name}
          </p>
          {recommendation.user_image && (
            <img
              src={recommendation.user_image}
              alt={recommendation.user_name}
              className="w-24 h-24 rounded-full shadow-subtle"
            />
          )}
        </div>
        <div className="space-y-2">
          <p className="text-body">
            <strong>Safety:</strong> {recommendation.safety_rating}/5
          </p>
          <p className="text-body">
            <strong>Food Price:</strong> {recommendation.food_price_rating}/5
          </p>
          <p className="text-body">
            <strong>Culture & Entertainment:</strong> {recommendation.culture_rating}/5
          </p>
          <p className="text-body">
            <strong>Affordability:</strong> {recommendation.affordability_rating}/5
          </p>
          <p className="text-body">
            <strong>Accessibility:</strong> {recommendation.accessibility_rating}/5
          </p>
          <p className="text-body">
            <strong>Quality of Life:</strong> {recommendation.quality_of_life_rating}/5
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
