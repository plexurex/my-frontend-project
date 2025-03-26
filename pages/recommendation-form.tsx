"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const RecommendationForm = () => {
    const router = useRouter();

    // Keep your existing states for countries & cities
    const [countries, setCountries] = useState<{ name: string; average_salary: number }[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    // Keep your original formData in snake_case
    const [formData, setFormData] = useState({
        country_name: "",
        city_name: "",
        safety_rating: 1,
        food_price_rating: 1,
        culture_rating: 1,
        affordability_rating: 1,
        accessibility_rating: 1,
        quality_of_life_rating: 1,
        name: "",
        image: null,
    });

    // Track if submission succeeded
    const [success, setSuccess] = useState(false);

    // Fetch countries on mount (unchanged from previous code)
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

    // Handle selecting a country from dropdown
    const handleCountrySelect = async (country: string) => {
        setSelectedCountry(country);
        setFormData((prev) => ({ ...prev, country_name: country }));

        // Fetch the cities for that country
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/countries/${encodeURIComponent(country)}/cities/`);
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

    // Handle selecting a city from dropdown
    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setFormData((prev) => ({ ...prev, city_name: city }));
    };

    // Generic handler for numeric/text fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle file input
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    // **NEW**: function to reset the form after a successful submission
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
            name: "",
            image: null,
        });
        setSelectedCountry("");
        setSelectedCity("");
        setSuccess(false);
    };

    // Submit the form (unchanged except for no redirect)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataWithImage = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key !== "image") {
                formDataWithImage.append(key, formData[key as keyof typeof formData] as string | Blob);
            }
        });
        if (formData.image) {
            formDataWithImage.append("image", formData.image);
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/submit-user-recommendation/", {
                method: "POST",
                body: formDataWithImage,
            });
            const result = await response.json();
            if (response.ok) {
                setSuccess(true);
            } else {
                alert(result.message || "An error occurred");
            }
        } catch (error) {
            alert("An error occurred while submitting the recommendation.");
        }
    };

    // If submission was successful, show a "Thanks" message & an "Add Another" button
    if (success) {
        return (
            <div className="p-4 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-4">Thanks for submitting!</h1>
                <p>Your recommendation has been submitted successfully.</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={resetForm}
                >
                    Add Another Recommendation
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Submit a Recommendation</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 
                  Country & City dropdowns (unchanged)
                  We do NOT show existing recommendations here, just empty form fields.
                */}
                <div>
                    <label className="block">Select Country</label>
                    <select
                        className="w-full border p-2 rounded"
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
                    <label className="block">Select City</label>
                    <select
                        className="w-full border p-2 rounded"
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

                {/* ORIGINAL TEXT INPUTS FOR COUNTRY & CITY (COMMENTED OUT) */}
                {/*
                <div>
                    <label className="block">Country Name</label>
                    <input
                        type="text"
                        name="country_name"
                        value={formData.country_name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block">City Name</label>
                    <input
                        type="text"
                        name="city_name"
                        value={formData.city_name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                */}

                {/* Ratings Section */}
                <div>
                    <label className="block">Safety (1-5)</label>
                    <input
                        type="number"
                        name="safety_rating"
                        min="1"
                        max="5"
                        value={formData.safety_rating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block">Food Price (1-5)</label>
                    <input
                        type="number"
                        name="food_price_rating"
                        min="1"
                        max="5"
                        value={formData.food_price_rating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block">Culture & Entertainment (1-5)</label>
                    <input
                        type="number"
                        name="culture_rating"
                        min="1"
                        max="5"
                        value={formData.culture_rating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block">Affordability (1-5)</label>
                    <input
                        type="number"
                        name="affordability_rating"
                        min="1"
                        max="5"
                        value={formData.affordability_rating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block">Accessibility/Transport (1-5)</label>
                    <input
                        type="number"
                        name="accessibility_rating"
                        min="1"
                        max="5"
                        value={formData.accessibility_rating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block">Quality of Life (1-5)</label>
                    <input
                        type="number"
                        name="quality_of_life_rating"
                        min="1"
                        max="5"
                        value={formData.quality_of_life_rating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block">Upload Image (optional)</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Submit Recommendation
                </button>
            </form>
        </div>
    );
};

export default RecommendationForm;
