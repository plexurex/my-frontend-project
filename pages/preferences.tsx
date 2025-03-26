// pages/preferences.tsx
import { useState } from "react";
import { useRouter } from "next/router";

const Preferences = () => {
  const router = useRouter();

  // User preferences state
  const [preferences, setPreferences] = useState({
    rent: "",
    salary: "",
    amenities: [] as string[], // Array of selected amenities
    mosques_nearby: false,
    churches_nearby: false,
    job_opportunities: false,
    quality_of_life: false,
    cost_of_living: false,
    public_transport: false,
    safety: false,
    education_quality: false,
  });

  // List of all available amenities from your JSON file
  const availableAmenities = [
    "Parks", "Beaches", "Museums", "Theaters", "Cafés", "Shopping Malls",
    "Markets", "Historical Sites", "Nightlife", "Public Transport",
    "Cultural Centers", "Libraries", "Restaurants", "Universities",
    "Bicycle Lanes", "Local Markets", "Seaside Walks", "Botanical Gardens",
    "Football Stadiums", "Concert Halls", "Government Buildings",
    "Harbor Views", "Ski Resorts", "Thermal Pools", "Thermal Springs",
    "Heritage Sites", "Night Markets", "Shopping Centers", "Riverside Walks",
    "Cultural Landmarks", "Entertainment Centers", "Churches", "Landmarks",
    "Airports"
  ];

  const [selectedAmenity, setSelectedAmenity] = useState("");

  // Handles checkbox updates for preferences
  const handleCheckboxChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct query parameters
    const params = new URLSearchParams({
      rent: preferences.rent,
      salary: preferences.salary,
      amenities: preferences.amenities.join(","), // Convert array to comma-separated string
      mosques_nearby: preferences.mosques_nearby ? "true" : "false",
      churches_nearby: preferences.churches_nearby ? "true" : "false",
      job_opportunities: preferences.job_opportunities ? "true" : "false",
      quality_of_life: preferences.quality_of_life ? "true" : "false",
      cost_of_living: preferences.cost_of_living ? "true" : "false",
      public_transport: preferences.public_transport ? "true" : "false",
      safety: preferences.safety ? "true" : "false",
      education_quality: preferences.education_quality ? "true" : "false",
    }).toString();

    // Redirect to recommendations page with preferences as query params
    router.push(`/recommendations?${params}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Set Your Preferences</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Rent & Salary Inputs */}
        <div>
          <label className="block font-medium mb-1">
            Maximum Rent (USD):
          </label>
          <input
            type="number"
            value={preferences.rent}
            onChange={(e) =>
              setPreferences({ ...preferences, rent: e.target.value })
            }
            className="border rounded p-2 w-full max-w-xs"
            placeholder="e.g. 2000"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Minimum Salary (USD):
          </label>
          <input
            type="number"
            value={preferences.salary}
            onChange={(e) =>
              setPreferences({ ...preferences, salary: e.target.value })
            }
            className="border rounded p-2 w-full max-w-xs"
            placeholder="e.g. 6000"
          />
        </div>

        {/* Desired Amenities Selection */}
        <div>
          <label className="block font-medium mb-1">
            Desired Amenities:
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="border rounded p-2 max-w-xs"
            >
              <option value="">Select an amenity</option>
              {availableAmenities.map((amenity, index) => (
                <option key={index} value={amenity}>
                  {amenity}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (selectedAmenity && !preferences.amenities.includes(selectedAmenity)) {
                  setPreferences((prev) => ({
                    ...prev,
                    amenities: [...prev.amenities, selectedAmenity],
                  }));
                  setSelectedAmenity("");
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Amenity
            </button>
          </div>
          {/* Display Selected Amenities */}
          <ul className="mt-2 space-y-1">
            {preferences.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      amenities: prev.amenities.filter((a) => a !== amenity),
                    }))
                  }
                  className="text-red-500 hover:underline"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Preferences</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.mosques_nearby}
                onChange={() => handleCheckboxChange("mosques_nearby")}
              />
              <span>Mosques Nearby</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.churches_nearby}
                onChange={() => handleCheckboxChange("churches_nearby")}
              />
              <span>Churches Nearby</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.job_opportunities}
                onChange={() => handleCheckboxChange("job_opportunities")}
              />
              <span>Job &amp; Career Opportunities</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.quality_of_life}
                onChange={() => handleCheckboxChange("quality_of_life")}
              />
              <span>Quality of Life &amp; Social Factors</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.cost_of_living}
                onChange={() => handleCheckboxChange("cost_of_living")}
              />
              <span>Cost of Living</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.public_transport}
                onChange={() => handleCheckboxChange("public_transport")}
              />
              <span>Public Transport Availability</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.safety}
                onChange={() => handleCheckboxChange("safety")}
              />
              <span>Safety &amp; Low Crime Rate</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.education_quality}
                onChange={() => handleCheckboxChange("education_quality")}
              />
              <span>High-Quality Education</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Find Countries
        </button>
      </form>
    </div>
  );
};

export default Preferences;
