"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const RecommendationForm = () => {
  const router = useRouter();

  // States for countries & cities
  const [countries, setCountries] = useState<
    { name: string; average_salary: number }[] 
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Form state in snake_case
  const [formData, setFormData] = useState({
    country_name: "",
    city_name: "",
    safety_rating: 1,
    food_price_rating: 1,
    culture_rating: 1,
    affordability_rating: 1,
    accessibility_rating: 1,
    quality_of_life_rating: 1,
    user_name: "", // Changed from "name" to "user_name"
    image: null as File | null,
  });

  // Track submission success
  const [success, setSuccess] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/get-countries/");
        if (!res.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await res.json();
        if (data.countries) {
          setCountries(data.countries);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // Handle country selection and fetch cities
  const handleCountrySelect = async (country: string) => {
    setSelectedCountry(country);
    setFormData((prev) => ({ ...prev, country_name: country }));

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/countries/${encodeURIComponent(
          country
        )}/cities/`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await res.json();
      if (Array.isArray(data.cities)) {
        const cityNames = data.cities.map((c: any) => c.name);
        setCities(cityNames);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    }
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setFormData((prev) => ({ ...prev, city_name: city }));
  };

  // Generic handler for inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Reset form after successful submission
  const resetForm = () => {
    setFormData({
      country_name: "",
      city_name: "",
      safety_rating: 1,
      food_price_rating: 1,
      culture_rating: 1,
      affordability_rating: 1,
      accessibility_rating: 1,
      quality_of_life_rating: 1,
      user_name: "", // Changed from "name" to "user_name"
      image: null,
    });
    setSelectedCountry("");
    setSelectedCity("");
    setSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    // Append all fields to formData (ensure image is correctly handled)
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData];

      // Ensure all values are converted to strings (since FormData expects string or Blob)
      if (key !== 'image') {
        formDataToSubmit.append(key, value.toString());
      } else {
        if (formData.image) {
          formDataToSubmit.append('user_image', formData.image); // Ensure field name matches backend
        }
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/submit-user-recommendation/", {
        method: "POST",
        body: formDataToSubmit,  // Let browser set the multipart/form-data header
      });
      const result = await response.json();
      if (response.ok) {
        alert("Recommendation submitted successfully!");
        setSuccess(true); // Mark the form as successfully submitted
      } else {
        alert(result.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting recommendation:", error);
      alert("An error occurred while submitting the recommendation.");
    }
  };

  if (success) {
    return (
      <div className="container mx-auto p-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Thanks for submitting!</h1>
        <p className="text-body mb-4">
          Your recommendation has been submitted successfully.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-surface rounded hover:bg-accent"
          onClick={resetForm}
        >
          Add Another Recommendation
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Submit a Recommendation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Country & City dropdowns */}
        <div>
          <label className="block font-medium mb-1">Select Country</label>
          <select
            className="w-full border border-subdued p-2 rounded"
            value={selectedCountry}
            onChange={(e) => handleCountrySelect(e.target.value)}
            required
          >
            <option value="">-- Choose a country --</option>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Select City</label>
          <select
            className="w-full border border-subdued p-2 rounded"
            value={selectedCity}
            onChange={(e) => handleCitySelect(e.target.value)}
            required
          >
            <option value="">-- Choose a city --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Ratings Section */}
        <div>
          <label className="block font-medium">Safety (1-5)</label>
          <input
            type="number"
            name="safety_rating"
            min="1"
            max="5"
            value={formData.safety_rating}
            onChange={handleChange}
            className="w-full border border-subdued p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Food Price (1-5)</label>
          <input
            type="number"
            name="food_price_rating"
            min="1"
            max="5"
            value={formData.food_price_rating}
            onChange={handleChange}
            className="w-full border border-subdued p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">
            Culture &amp; Entertainment (1-5)
          </label>
          <input
            type="number"
            name="culture_rating"
            min="1"
            max="5"
            value={formData.culture_rating}
            onChange={handleChange}
            className="w-full border border-subdued p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Affordability (1-5)</label>
          <input
            type="number"
            name="affordability_rating"
            min="1"
            max="5"
            value={formData.affordability_rating}
            onChange={handleChange}
            className="w-full border border-subdued p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">
            Accessibility/Transport (1-5)
          </label>
          <input
            type="number"
            name="accessibility_rating"
            min="1"
            max="5"
            value={formData.accessibility_rating}
            onChange={handleChange}
            className="w-full border border-subdued p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Quality of Life (1-5)</label>
          <input
            type="number"
            name="quality_of_life_rating"
            min="1"
            max="5"
            value={formData.quality_of_life_rating}
            onChange={handleChange}
            className="w-full border border-subdued p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Your Name</label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className="w-full border border-subdued p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-primary text-surface rounded shadow-medium hover:bg-accent"
        >
          Submit Recommendation
        </button>
      </form>
    </div>
  );
};

export default RecommendationForm;
