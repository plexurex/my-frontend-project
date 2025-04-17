"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchRecommendation = async () => {
      setLoading(true);
      setError("");
      try {
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

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-accent";
    return "text-error";
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-body text-center">Loading recommendation details...</p>
      </div>
    );
    
  if (error)
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-error/10 border-l-4 border-error p-6 rounded-lg">
          <p className="text-body text-error text-center">{error}</p>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => router.push('/user-recommendations')}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Back to Recommendations
            </button>
          </div>
        </div>
      </div>
    );
    
  if (!recommendation)
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-skyblue/10 border-l-4 border-skyblue p-6 rounded-lg text-center">
          <p className="text-body">No recommendation found.</p>
          <div className="mt-4">
            <Link href="/user-recommendations">
              <button className="px-4 py-2 bg-skyblue text-white rounded-lg">
                View All Recommendations
              </button>
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className={`container mx-auto px-6 py-8 ${mounted ? 'animate-fade-in' : ''}`}>
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">City Review</h1>
        <p className="text-center mt-2 opacity-90">User experience in {recommendation.city_name}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-surface p-8 rounded-xl shadow-medium">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-h2 font-heading text-primary">
                {recommendation.city_name}, <span className="text-subdued">{recommendation.country_name}</span>
              </h2>
              <Link 
                href={`/city-details/${encodeURIComponent(recommendation.city_name)}`}
                className="px-4 py-2 bg-skyblue hover:bg-skyblue/90 text-white rounded-lg text-sm transition"
              >
                View City Details
              </Link>
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-4">
              {recommendation.user_image ? (
                <img
                  src={recommendation.user_image}
                  alt={recommendation.user_name}
                  className="w-16 h-16 rounded-full shadow-medium object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-skyblue rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {recommendation.user_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold">{recommendation.user_name}</p>
                <p className="text-subdued text-sm">Reviewed this city</p>
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="mb-8">
            <h3 className="text-h4 font-heading text-primary mb-4">City Ratings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Safety", value: recommendation.safety_rating },
                { label: "Food Price", value: recommendation.food_price_rating },
                { label: "Culture & Entertainment", value: recommendation.culture_rating },
                { label: "Affordability", value: recommendation.affordability_rating },
                { label: "Transportation & Accessibility", value: recommendation.accessibility_rating },
                { label: "Overall Quality of Life", value: recommendation.quality_of_life_rating }
              ].map((rating, i) => (
                <div key={i} className="bg-background p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-subdued">{rating.label}</span>
                    <span className={`font-bold ${getRatingColor(rating.value)}`}>{rating.value}/5</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        rating.value >= 4 ? 'bg-green-600' : 
                        rating.value >= 3 ? 'bg-accent' : 'bg-error'
                      }`} 
                      style={{ width: `${(rating.value / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Average Rating */}
          <div className="bg-primary/5 p-4 rounded-lg mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-h5 font-heading text-primary">Average Rating</h3>
              <p className="text-subdued text-sm">Across all categories</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F97316" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span className="text-xl font-bold">{(
                (recommendation.safety_rating +
                recommendation.food_price_rating +
                recommendation.culture_rating +
                recommendation.affordability_rating +
                recommendation.accessibility_rating +
                recommendation.quality_of_life_rating) / 6
              ).toFixed(1)}</span>
              <span className="text-subdued ml-1">/5</span>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Link href="/user-recommendations">
              <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors w-full sm:w-auto">
                Back to Recommendations
              </button>
            </Link>
            <Link href="/recommendation-form">
              <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors w-full sm:w-auto">
                Share Your Experience
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReview;