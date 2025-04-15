"use client";
import { useState } from "react";
import Link from "next/link";

const SearchCountry = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<{ country: string; cities: { name: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      // Call your backend endpoint to fetch cities for the given country
      const res = await fetch(`http://127.0.0.1:8000/api/countries/${encodeURIComponent(searchQuery)}/cities/`);
      if (!res.ok) {
        throw new Error("Country not found or error occurred");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search for a Country</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter country name..."
          className="w-full border p-2 rounded"
          required
        />
        <button 
          type="submit"
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{result.country}</h2>
          {result.cities && result.cities.length > 0 ? (
            <ul className="list-disc ml-6">
              {result.cities.map((city, index) => (
                <li key={index}>
                  <Link href={`/city-details/${encodeURIComponent(city.name)}`}>
                    <span className="text-blue-600 hover:underline">{city.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No cities found for this country.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCountry;
