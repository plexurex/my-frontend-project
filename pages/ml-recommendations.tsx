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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  
    const fetchMLRecommendations = async () => {
      setLoading(true);
      setError("");
  
      try {
        const params = new URLSearchParams(searchParams.toString());
        
        const followupResponses = searchParams.get('followup_responses');
if (followupResponses) {
  try {
    if (!params.has('followup_responses')) {
      params.append('followup_responses', followupResponses);
    }
    
    // Extract country mentions to add as explicit parameters
    const responses = JSON.parse(followupResponses);
    
    // Process responses for specific country mentions
    for (const [questionIdx, response] of Object.entries(responses)) {
      const responseText = String(response).toLowerCase();
      
      // Look for country mentions
      const countryMentions = [
        "malaysia", "singapore", "japan", "australia", "usa", "uk", 
        "canada", "germany", "france", "dubai", "spain", "italy"
      ];
      
      countryMentions.forEach(country => {
        if (responseText.includes(country.toLowerCase())) {
          params.append('preferred_country', country);
          console.log(`Detected interest in ${country} from response`);
        }
      });
      
      // Check for other preferences
      if (responseText.includes("safe") || responseText.includes("security")) {
        params.append('safety_priority', 'high');
      }
      
      if (responseText.includes("job") || responseText.includes("career") || responseText.includes("work")) {
        params.append('job_priority', 'high');
      }
    }
    
    console.log("Processed follow-up responses:", followupResponses);
  } catch (error) {
    console.error("Error handling followup responses:", error);
  }
}
        
        // Log parameters being sent (for debugging)
        console.log("Sending parameters:", Object.fromEntries(params.entries()));
        
        const res = await fetch(`http://127.0.0.1:8000/api/ml-recommendations/?${params.toString()}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching ML recommendations: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Received cities:", data.recommended_cities);
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
    <div className="container mx-auto px-6 py-8">
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">ML-Based City Recommendations</h1>
        <p className="text-center mt-2 opacity-90">Personalized city suggestions powered by machine learning</p>
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
            className="mt-4 bg-skyblue hover:bg-skyblue/90 text-white"
          >
            Adjust Your Preferences
          </button>
        </div>
      ) : (
        <div className={`space-y-12 ${mounted ? 'animate-fade-in' : ''}`}>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cities.map((city, index) => (
              <li
                key={index}
                className="cursor-pointer p-6 bg-surface rounded-xl shadow-medium hover:shadow-lg transform transition-all duration-300 hover:-translate-y-2 border-l-4 border-accent"
                onClick={() => handleCityClick(city.city)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-h3 font-heading text-primary mb-2">
                      {city.city}
                    </h2>
                    <p className="text-subdued mb-4">{city.country}</p>
                  </div>
                  <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                    {Math.min(Math.round(city.similarity * 100), 100)}% Match
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm"> Average Monthly Salary</p>
                    <p className="text-lg font-bold">${city.average_salary}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm">Average Monthly Rent</p>
                    <p className="text-lg font-bold">${city.average_rent}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm">Safety</p>
                    <p className="text-lg font-bold">{city.safety_index}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-subdued text-sm">Quality of Life</p>
                    <p className="text-lg font-bold">{city.quality_of_life_index}</p>
                  </div>
                </div>
                
                <button className="mt-6 w-full bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-lg">
                  View Details
                </button>
              </li>
            ))}
          </ul>
          
          <div className="bg-surface p-8 rounded-xl shadow-medium">
            <h2 className="text-h2 font-heading text-primary mb-8 text-center">
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
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/preferences')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Refine Your Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}