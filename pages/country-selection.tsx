import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CountrySelection() {
  const router = useRouter();
  const [countries, setCountries] = useState<{ name: string; average_salary: number | "N/A" }[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<{ name: string; average_salary: number | "N/A" }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(""); // User-selected country
  const [userBudget, setUserBudget] = useState<number | null>(null); // Budget from localStorage
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    // Retrieve user preferences (including budget) from localStorage
    const savedPreferences = localStorage.getItem("preferences");
    if (savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences);
      if (parsedPreferences.salary) {
        setUserBudget(parseFloat(parsedPreferences.salary)); // Get user budget
      }
    }

    // Fetch country data from the backend API
    fetch("http://127.0.0.1:8000/api/get-countries/") // ✅ FIXED API ENDPOINT
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.countries)) { // ✅ Correctly access "countries" key
          console.log("DEBUG - Fetched Countries:", data.countries);
          setCountries(data.countries);
          setFilteredCountries(data.countries); // Initially show all countries
        } else {
          throw new Error("Invalid API response format");
        }
      })
      .catch((err) => {
        console.error("Failed to load countries:", err);
        setError("Failed to fetch countries. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Apply filtering based on user budget
    if (userBudget !== null) {
      const filtered = countries.filter(
        (country) =>
          country.average_salary !== "N/A" &&
          country.average_salary !== null &&
          country.average_salary >= userBudget
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [userBudget, countries]);

  const handleSeeCities = () => {
    // Navigate to the cities page for the selected country
    if (selectedCountry) {
      router.push(`/cities/${encodeURIComponent(selectedCountry)}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-surface p-6 rounded-medium shadow-medium">
        <h1 className="text-h1 font-heading mb-4">Select a Country</h1>
        {loading ? (
          <p className="text-body text-center">Loading countries...</p>
        ) : error ? (
          <p className="text-body text-error text-center">{error}</p>
        ) : (
          <>
            <h3 className="text-h3 mb-4">
              Minimum Salary Requirement: ${userBudget ?? "Not Set"}
            </h3>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border border-subdued p-2 rounded-medium mb-4"
            >
              <option value="">-- Select a Country --</option>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name} (Avg Salary: ${country.average_salary !== "N/A" ? country.average_salary : "N/A"})
                  </option>
                ))
              ) : (
                <option disabled>No countries match your budget</option>
              )}
            </select>
            {selectedCountry && (
              <button
                onClick={handleSeeCities}
                className="mt-4 px-4 py-2 bg-primary text-surface rounded-medium shadow-medium hover:bg-accent"
              >
                See Cities
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
