"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CityComparisonChart from "../components/CityComparisonChart";
import UserPreferencesDonut from "../components/UserPreferencesDonut";
import LoadingSpinner from "../components/LoadingSpinner";

const Recommendations = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ rating: 1, comment: "" });
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [aggregatedPreferences, setAggregatedPreferences] = useState<{ [key: string]: number }>({});
  const [mounted, setMounted] = useState(false);

  // Fetch the recommended cities
  useEffect(() => {
    setMounted(true);
    const fetchCities = async () => {
      setLoading(true);
      setError("");

      try {
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

  // Fetch aggregated feedback (for the donut chart)
  useEffect(() => {
    const fetchAggregatedPreferences = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/aggregate-feedback/");
        if (!res.ok) {
          throw new Error(`Error fetching feedback aggregation: ${res.status}`);
        }
        const data = await res.json();
        setAggregatedPreferences(data);
      } catch (err) {
        console.error("Failed to fetch aggregated preferences:", err);
      }
    };

    fetchAggregatedPreferences();
  }, []);

  const handleCityClick = (cityName: string) => {
    router.push(`/city-details/${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">Recommended Cities</h1>
        <p className="text-center mt-2 opacity-90">Cities to consider for your journey</p>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
          <p className="mt-4 text-subdued">Finding your ideal cities...</p>
        </div>
      ) : error ? (
        <div className="bg-error/10 border-l-4 border-error p-4 rounded-lg">
          <p className="text-body text-error">{error}</p>
        </div>
      ) : cities.length === 0 ? (
        <div className="bg-skyblue/10 border-l-4 border-skyblue p-6 rounded-lg text-center">
          <p className="text-body">No matching cities found based on your criteria.</p>
          <button 
            onClick={() => router.push('/preferences')}
            className="mt-4 bg-skyblue hover:bg-skyblue/90 text-white px-4 py-2 rounded-lg"
          >
            Adjust Your Preferences
          </button>
        </div>
      ) : (
        <div className={`space-y-12 ${mounted ? 'animate-fade-in' : ''}`}>
          {/* City Cards Grid */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cities.map((city, index) => (
              <li
                key={index}
                className="cursor-pointer p-6 bg-surface rounded-xl shadow-medium hover:shadow-lg transform transition-all duration-300 hover:-translate-y-2 border-l-4 border-accent"
                onClick={() => handleCityClick(city.name)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-h3 font-heading text-primary mb-2">
                      {city.name}
                    </h2>
                    <p className="text-subdued mb-4">{city.country}</p>
                  </div>
                  <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                    {city.match_score ? `${Math.round(city.match_score * 100)}% Match` : 'Recommended'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm">Safety</p>
                    <p className="text-lg font-bold">{city.safety_index}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm">Quality of Life</p>
                    <p className="text-lg font-bold">{city.quality_of_life_index}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm">Average Monthly Salary</p>
                    <p className="text-lg font-bold">${city.average_salary}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm">Average Monthly Rent</p>
                    <p className="text-lg font-bold">${city.average_rent}</p>
                  </div>
                </div>
                
                <button className="mt-6 w-full bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-lg">
                  View Details
                </button>
              </li>
            ))}
          </ul>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* City Comparison Chart */}
            <div className="bg-surface p-8 rounded-xl shadow-medium">
              <h2 className="text-h2 font-heading text-primary mb-6 text-center">
                Compare City Metrics
              </h2>
              <CityComparisonChart cities={cities} />
            </div>
            
            {/* User Preferences Donut */}
            <div className="bg-surface p-8 rounded-xl shadow-medium">
              <h2 className="text-h2 font-heading text-primary mb-6 text-center">
                User Preference Breakdown
              </h2>
              <UserPreferencesDonut data={aggregatedPreferences} />
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/preferences')}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow-lg"
            >
              Refine Your Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;