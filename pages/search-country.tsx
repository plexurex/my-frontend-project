"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";

const SearchCountry = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<{ country: string; cities: { name: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  const [popularCountries, setPopularCountries] = useState([
    "United States", "United Kingdom", "Canada", "Australia", 
    "Germany", "Japan", "Singapore", "United Arab Emirates"
  ]);

  useEffect(() => {
    setMounted(true);
    // Get recent searches from localStorage
    const savedSearches = localStorage.getItem("recentCountrySearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Fetch all available countries for autocomplete
    fetchAllCountries();
    
    // Add click event listener to hide suggestions when clicking outside
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const fetchAllCountries = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-countries/");
      if (!res.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await res.json();
      if (data.countries) {
        const countryNames = data.countries.map((country: any) => country.name);
        setAllCountries(countryNames);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  };
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = allCountries.filter(country => 
        country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCountries([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allCountries]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(searchQuery);
  };
  
  const performSearch = async (country: string) => {
    if (!country.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    setShowSuggestions(false);
    
    try {
      // Call your backend endpoint to fetch cities for the given country
      const res = await fetch(`http://127.0.0.1:8000/api/countries/${encodeURIComponent(country.trim())}/cities/`);
      
      if (!res.ok) {
        throw new Error("Country not found or error occurred");
      }
      
      const data = await res.json();
      setResult(data);
      
      // Save this search to recent searches
      const updatedSearches = [country, ...recentSearches.filter(s => s !== country)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentCountrySearches", JSON.stringify(updatedSearches));
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (country: string) => {
    setSearchQuery(country);
    performSearch(country);
  };
  
  const selectSuggestion = (country: string) => {
    setSearchQuery(country);
    setShowSuggestions(false);
    performSearch(country);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">Search Countries</h1>
        <p className="text-center mt-2 opacity-90">Find cities and explore migration destinations</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Search Form */}
        <div className={`bg-surface p-8 rounded-xl shadow-medium mb-8 ${mounted ? 'animate-fade-in' : ''}`}>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-h5 font-heading text-primary mb-2">Enter a Country Name</label>
              <div className="relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Canada, Japan, Germany..."
                  className="w-full border border-subdued p-3 pl-10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  required
                />
                <div className="absolute left-3 top-3 text-subdued">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Country Suggestions Dropdown */}
                {showSuggestions && filteredCountries.length > 0 && (
                  <div 
                    ref={suggestionRef}
                    className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                  >
                    {filteredCountries.map((country, index) => (
                      <div
                        key={index}
                        className="cursor-pointer px-4 py-2 hover:bg-primary/10 transition-colors"
                        onClick={() => selectSuggestion(country)}
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button 
              type="submit"
              className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg flex items-center justify-center transition-all transform hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-t-2 border-r-2 border-white border-opacity-50 rounded-full animate-spin mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  Search Country
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </>
              )}
            </button>
          </form>
          
          {/* Quick Access Sections */}
          <div className="mt-8 space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-body font-bold mb-2 text-primary">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button 
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="px-3 py-1 bg-skyblue/10 text-skyblue rounded-full text-sm hover:bg-skyblue/20 transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Popular Countries */}
            <div>
              <h3 className="text-body font-bold mb-2 text-primary">Popular Countries</h3>
              <div className="flex flex-wrap gap-2">
                {popularCountries.map((country, index) => (
                  <button 
                    key={index}
                    onClick={() => handleQuickSearch(country)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-all"
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {error ? (
          <div className="bg-error/10 border-l-4 border-error p-6 rounded-lg animate-fade-in">
            <h3 className="text-h4 font-heading text-error mb-2">Country Not Found</h3>
            <p className="text-subdued">We couldn't find information for "{searchQuery}". Please check the spelling or try another country.</p>
          </div>
        ) : result ? (
          <div className="bg-surface p-8 rounded-xl shadow-medium animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-h2 font-heading text-primary">{result.country}</h2>
                <p className="text-subdued">{result.cities.length} Cities Available</p>
              </div>
            </div>
            
            {result.cities && result.cities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {result.cities.map((city, index) => (
                  <Link 
                    key={index} 
                    href={`/city-details/${encodeURIComponent(city.name)}`}
                    className="bg-background p-4 rounded-lg hover:shadow-medium transition-all transform hover:-translate-y-1 hover:bg-primary/5 border border-subdued/20"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-skyblue to-secondary rounded-full flex items-center justify-center text-white mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-primary font-semibold">{city.name}</h3>
                        <p className="text-xs text-subdued">View details</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-skyblue/10 border-l-4 border-skyblue p-4 rounded-lg">
                <p className="text-subdued">No cities found for this country.</p>
              </div>
            )}
            
            {/* Compare Cities Button */}
            {result.cities && result.cities.length > 1 && (
              <div className="mt-8 text-center">
                <Link 
                  href={`/compare-cities/${encodeURIComponent(result.country)}`}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg inline-flex items-center transition-all transform hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                  Compare Cities in {result.country}
                </Link>
              </div>
            )}
          </div>
        ) : null}
        
        {/* Intro Section for new users */}
        {!result && !error && !loading && (
          <div className="bg-surface p-8 rounded-xl shadow-medium mt-8 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-h3 font-heading text-primary mb-4">Find Your Destination</h2>
              <p className="text-subdued mb-4">
                Search for any country to discover cities that could be your next home. 
                Get detailed information about living costs, job opportunities, and more.
              </p>
              <ul className="space-y-2">
                {[
                  "View available cities in each country",
                  "Access detailed city information",
                  "Compare multiple cities side by side",
                  "Discover quality of life metrics"
                ].map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-primary to-skyblue rounded-xl h-48 md:h-64 flex items-center justify-center text-white text-center p-6">
                <div>
                  <div className="text-5xl mb-4">🌎</div>
                  <p className="text-xl font-bold">Explore Global Opportunities</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCountry;