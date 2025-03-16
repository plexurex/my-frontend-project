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
                    console.log("DEBUG - Fetched Countries:", data.countries); // ✅ Debugging log
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
        <div>
            <h1>Select a Country</h1>

            {loading ? (
                <p>Loading countries...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <>
                    <h3>Minimum Salary Requirement: ${userBudget ?? "Not Set"}</h3>

                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
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

                    <br />
                    {selectedCountry && (
                        <button onClick={handleSeeCities} style={{ marginTop: "10px" }}>
                            See Cities
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
