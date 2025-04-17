"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/LoadingSpinner";

const UserRecommendations = () => {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [filterCountry, setFilterCountry] = useState("");
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
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
        
        // Extract unique countries for filtering
        const uniqueCountries = Array.from(
          new Set(data.recommendations.map((rec: any) => rec.country_name))
        ).sort();
        setCountries(uniqueCountries as string[]);
      } catch (err) {
        console.error("Failed to fetch user recommendations:", err);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Filter recommendations by country if filter is set
  const filteredRecommendations = filterCountry 
    ? recommendations.filter(rec => rec.country_name === filterCountry)
    : recommendations;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-accent";
    return "text-error";
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">Community Recommendations</h1>
        <p className="text-center mt-2 opacity-90">Real experiences from real travelers</p>
      </div>

      {/* Filters */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-h4 font-heading text-primary">Browse {recommendations.length} User Reviews</h2>
              <p className="text-subdued mt-1">Discover insights from people who've been there</p>
            </div>
            <div className="w-full md:w-auto">
              <select 
                className="w-full md:w-64 p-2 border border-subdued rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-white"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
          
          {filterCountry && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-subdued mr-2">Filtered by:</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                {filterCountry}
                <button 
                  onClick={() => setFilterCountry("")} 
                  className="ml-2 text-primary hover:text-error"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
          <p className="mt-4 text-subdued">Loading community recommendations...</p>
        </div>
      ) : error ? (
        <div className="bg-error/10 border-l-4 border-error p-4 rounded-lg">
          <p className="text-body text-error">{error}</p>
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <div className="bg-skyblue/10 border-l-4 border-skyblue p-6 rounded-lg text-center">
          <p className="text-body">
            {filterCountry 
              ? `No recommendations found for ${filterCountry}.` 
              : "No recommendations found yet."
            }
          </p>
          <button 
            onClick={() => router.push('/recommendation-form')}
            className="mt-4 bg-skyblue hover:bg-skyblue/90 text-white px-4 py-2 rounded-lg"
          >
            Be the First to Share Your Experience
          </button>
        </div>
      ) : (
        <div className={`space-y-8 ${mounted ? 'animate-fade-in' : ''}`}>
          <div className="grid grid-cols-1 gap-6">
            {filteredRecommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-surface p-6 rounded-xl shadow-medium hover:shadow-lg transition-all duration-300 border-l-4 border-secondary"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* City Information */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-h3 font-heading text-primary">
                          {rec.city_name}
                        </h2>
                        <p className="text-subdued">{rec.country_name}</p>
                      </div>
                      <Link 
                        href={`/city-details/${encodeURIComponent(rec.city_name)}`}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm hover:bg-primary/20 transition-all"
                      >
                        View City
                      </Link>
                    </div>
                    
                    {/* Ratings Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-background p-3 rounded-lg">
                        <p className="text-subdued text-sm">Safety</p>
                        <p className={`text-lg font-bold ${getRatingColor(rec.safety_rating)}`}>
                          {rec.safety_rating}/5
                        </p>
                      </div>
                      
                      <div className="bg-background p-3 rounded-lg">
                        <p className="text-subdued text-sm">Food Price</p>
                        <p className={`text-lg font-bold ${getRatingColor(rec.food_price_rating)}`}>
                          {rec.food_price_rating}/5
                        </p>
                      </div>
                      
                      <div className="bg-background p-3 rounded-lg">
                        <p className="text-subdued text-sm">Culture</p>
                        <p className={`text-lg font-bold ${getRatingColor(rec.culture_rating)}`}>
                          {rec.culture_rating}/5
                        </p>
                      </div>
                      
                      <div className="bg-background p-3 rounded-lg">
                        <p className="text-subdued text-sm">Affordability</p>
                        <p className={`text-lg font-bold ${getRatingColor(rec.affordability_rating)}`}>
                          {rec.affordability_rating}/5
                        </p>
                      </div>
                      
                      <div className="bg-background p-3 rounded-lg">
                        <p className="text-subdued text-sm">Transport</p>
                        <p className={`text-lg font-bold ${getRatingColor(rec.accessibility_rating)}`}>
                          {rec.accessibility_rating}/5
                        </p>
                      </div>
                      
                      <div className="bg-background p-3 rounded-lg">
                        <p className="text-subdued text-sm">Quality of Life</p>
                        <p className={`text-lg font-bold ${getRatingColor(rec.quality_of_life_rating)}`}>
                          {rec.quality_of_life_rating}/5
                        </p>
                      </div>
                    </div>
                  </div>
                  
                 
                  {/* User Information */}
                  <div className="lg:w-64 mt-4 lg:mt-0 lg:ml-6 flex flex-row lg:flex-col items-center lg:border-l lg:border-subdued/20 lg:pl-6">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-primary to-skyblue rounded-full flex items-center justify-center text-white text-2xl font-bold mb-0 lg:mb-3 mr-4 lg:mr-0">
                      {rec.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col lg:items-center">
                      <p className="font-medium text-primary">{rec.user_name}</p>
                      <div className="lg:mt-3 flex lg:flex-col lg:items-center">
                        <span className="text-sm text-subdued bg-background px-3 py-1 rounded-full">
                          Traveler
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Link href="/recommendation-form">
              <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg transform transition hover:-translate-y-1">
                Share Your Experience
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRecommendations;