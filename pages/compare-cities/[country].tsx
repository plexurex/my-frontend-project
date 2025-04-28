"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import LoadingSpinner from "../../components/LoadingSpinner";

type CityData = {
  name: string;
  population: number;
  average_rent: number;
  average_salary: number;
  safety_index: number;
  quality_of_life_index: number;
  cost_of_living_index: number;
  selected?: boolean;
};

const CompareCities = () => {
  const router = useRouter();
  const { country } = router.query;
  const [cities, setCities] = useState<CityData[]>([]);
  const [selectedCities, setSelectedCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (country) {
      fetchCitiesData();
    }
  }, [country]);

  const fetchCitiesData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/countries/${encodeURIComponent(country as string)}/cities/`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      
      const data = await res.json();
      console.log("Raw city data from API:", data); // Debug log
      
      if (data.cities && Array.isArray(data.cities)) {
        // Process city data for each city to ensure all properties exist
        const citiesWithSelection = data.cities.map((city: any) => ({
          name: city.name || 'Unknown',
          population: city.population || 0,
          average_rent: city.average_rent || 0,
          average_salary: city.average_salary || 0,
          safety_index: city.safety_index || 0,
          quality_of_life_index: city.quality_of_life_index || 0,
          cost_of_living_index: city.cost_of_living_index || 0,
          selected: false
        }));
        
        console.log("Processed city data:", citiesWithSelection); // Debug log
        setCities(citiesWithSelection);
      } else {
        setCities([]);
      }
    } catch (err: any) {
      console.error("Error fetching cities:", err);
      setError(err.message || "Failed to load cities data");
    } finally {
      setLoading(false);
    }
  };

  const toggleCitySelection = (city: CityData) => {
    const updatedCities = cities.map(c => {
      if (c.name === city.name) {
        return { ...c, selected: !c.selected };
      }
      return c;
    });
    
    setCities(updatedCities);
    
    // Update the selectedCities array
    const newSelectedCities = updatedCities.filter(c => c.selected);
    setSelectedCities(newSelectedCities);
  };

  const getMetricClass = (value: number, metric: string) => {
    if (value === 0) return ''; // Don't apply color if value is 0 (likely N/A)
    
    if (metric === 'safety_index' || metric === 'quality_of_life_index') {
      if (value >= 70) return 'text-green-600';
      if (value >= 50) return 'text-accent';
      return 'text-error';
    }
    
    if (metric === 'cost_of_living_index') {
      if (value <= 50) return 'text-green-600';
      if (value <= 70) return 'text-accent';
      return 'text-error';
    }
    
    return '';
  };

  // Helper function to format values properly
  const formatValue = (value: any, type: string) => {
    if (value === 0 || value === null || value === undefined) {
      return 'N/A';
    }
    
    if (type === 'money') {
      return `$${value.toLocaleString()}`;
    }
    
    return value.toLocaleString();
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">Compare Cities in {country}</h1>
        <p className="text-center mt-2 opacity-90">Select cities to compare their features side by side</p>
      </div>
      
      <div className="mb-6 flex items-center">
        <Link 
          href={`/search-country`}
          className="inline-flex items-center text-primary hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Search
        </Link>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
          <p className="mt-4 text-subdued">Loading cities in {country}...</p>
        </div>
      ) : error ? (
        <div className="bg-error/10 border-l-4 border-error p-6 rounded-lg">
          <p className="text-body text-error">{error}</p>
        </div>
      ) : cities.length === 0 ? (
        <div className="bg-skyblue/10 border-l-4 border-skyblue p-6 rounded-lg text-center">
          <p className="text-body">No cities found for {country}.</p>
        </div>
      ) : (
        <div className={`space-y-8 ${mounted ? 'animate-fade-in' : ''}`}>
          {/* City Selection */}
          <div className="bg-surface p-8 rounded-xl shadow-medium">
            <h2 className="text-h3 font-heading text-primary mb-4">Select Cities to Compare</h2>
            <p className="text-subdued mb-6">Choose 1-3 cities to view a detailed comparison</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cities.map((city, index) => (
                <div 
                  key={index}
                  onClick={() => toggleCitySelection(city)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    city.selected 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-background border-subdued/20 hover:border-accent'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={city.selected}
                      onChange={() => {}} // Handled by the div onClick
                      className="form-checkbox h-5 w-5 text-accent rounded focus:ring-accent"
                    />
                    <span className="ml-2 font-medium">{city.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Comparison Table */}
          {selectedCities.length >= 2 && (
            <div className="bg-surface p-8 rounded-xl shadow-medium overflow-x-auto">
              <h2 className="text-h3 font-heading text-primary mb-6">City Comparison</h2>
              
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4">Metric</th>
                    {selectedCities.map((city, index) => (
                      <th key={index} className="text-left py-3 px-4 text-primary">{city.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Population</td>
                    {selectedCities.map((city, index) => (
                      <td key={index} className="py-3 px-4">{formatValue(city.population, 'number')}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Average Monthly Rent</td>
                    {selectedCities.map((city, index) => (
                      <td key={index} className="py-3 px-4">{formatValue(city.average_rent, 'money')}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Average Monthly Salary</td>
                    {selectedCities.map((city, index) => (
                      <td key={index} className="py-3 px-4">{formatValue(city.average_salary, 'money')}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Safety Index</td>
                    {selectedCities.map((city, index) => (
                      <td key={index} className={`py-3 px-4 ${getMetricClass(city.safety_index, 'safety_index')}`}>
                        {formatValue(city.safety_index, 'number')}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Quality of Life</td>
                    {selectedCities.map((city, index) => (
                      <td key={index} className={`py-3 px-4 ${getMetricClass(city.quality_of_life_index, 'quality_of_life_index')}`}>
                        {formatValue(city.quality_of_life_index, 'number')}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Cost of Living</td>
                    {selectedCities.map((city, index) => (
                      <td key={index} className={`py-3 px-4 ${getMetricClass(city.cost_of_living_index, 'cost_of_living_index')}`}>
                        {formatValue(city.cost_of_living_index, 'number')}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              
              <div className="mt-6 flex flex-wrap gap-4">
                {selectedCities.map((city, index) => (
                  <Link
                    key={index}
                    href={`/city-details/${encodeURIComponent(city.name)}`}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg inline-flex items-center transition-colors"
                  >
                    View {city.name} Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompareCities;