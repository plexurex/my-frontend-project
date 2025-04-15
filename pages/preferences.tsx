"use client";
import { useState } from "react";
import { useRouter } from "next/router";

const Preferences = () => {
  const router = useRouter();

  // User preferences state
  const [preferences, setPreferences] = useState({
    rent: "",
    salary: "",
    amenities: [] as string[],
    mosques_nearby: false,
    churches_nearby: false,
    job_opportunities: false,
    quality_of_life: false,
    cost_of_living: false,
    public_transport: false,
    safety: false,
    education_quality: false,
  });

  // State to manage follow-up questions and responses
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [followUpError, setFollowUpError] = useState("");
  const [error, setError] = useState<string | null>(null);

  // List of all available amenities
  const availableAmenities = [
    "Parks",
    "Beaches",
    "Museums",
    "Theaters",
    "Cafés",
    "Shopping Malls",
    "Markets",
    "Historical Sites",
    "Nightlife",
    "Public Transport",
    "Cultural Centers",
    "Libraries",
    "Restaurants",
    "Universities",
    "Bicycle Lanes",
    "Local Markets",
    "Seaside Walks",
    "Botanical Gardens",
    "Football Stadiums",
    "Concert Halls",
    "Government Buildings",
    "Harbor Views",
    "Ski Resorts",
    "Thermal Pools",
    "Thermal Springs",
    "Heritage Sites",
    "Night Markets",
    "Shopping Centers",
    "Riverside Walks",
    "Cultural Landmarks",
    "Entertainment Centers",
    "Churches",
    "Landmarks",
    "Airports",
  ];

  const [selectedAmenity, setSelectedAmenity] = useState("");

  // Handles checkbox updates for preferences
  const handleCheckboxChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handles form submission (final submission uses only basic preferences)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct query parameters from basic preferences
    const params = new URLSearchParams({
      rent: preferences.rent,
      salary: preferences.salary,
      amenities: preferences.amenities.join(","),
      mosques_nearby: preferences.mosques_nearby ? "true" : "false",
      churches_nearby: preferences.churches_nearby ? "true" : "false",
      job_opportunities: preferences.job_opportunities ? "true" : "false",
      quality_of_life: preferences.quality_of_life ? "true" : "false",
      cost_of_living: preferences.cost_of_living ? "true" : "false",
      public_transport: preferences.public_transport ? "true" : "false",
      safety: preferences.safety ? "true" : "false",
      education_quality: preferences.education_quality ? "true" : "false",
    }).toString();

    // (Optionally, merge userResponses into the query if needed for refinement)

    router.push(`/recommendations?${params}`);
  };

  // Function to call the backend to get follow-up questions from GPT-3
  const fetchFollowUpQuestions = async () => {
    setLoadingFollowUp(true);
    setFollowUpError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/generate-followup-questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ preferences }),
        cache: "no-cache",
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch follow-up questions: ${res.status}`);
      }
  
      const data = await res.json();
      setFollowUpQuestions(data.questions || []);
    } catch (error: any) {
      console.error("Error fetching follow-up questions:", error);
      setFollowUpError("Failed to fetch follow-up questions. Please try again.");
    } finally {
      setLoadingFollowUp(false);
    }
  };

  // Handle user response to a follow-up question (use index as key)
  const handleQuestionResponse = (questionIndex: string, answer: string) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Set Your Preferences</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="border border-subdued p-2 rounded w-full max-w-xs"
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
            className="border border-subdued p-2 rounded w-full max-w-xs"
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
              className="border border-subdued p-2 rounded w-full max-w-xs"
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
                if (
                  selectedAmenity &&
                  !preferences.amenities.includes(selectedAmenity)
                ) {
                  setPreferences((prev) => ({
                    ...prev,
                    amenities: [...prev.amenities, selectedAmenity],
                  }));
                  setSelectedAmenity("");
                }
              }}
              className="px-4 py-2 bg-primary text-surface rounded hover:bg-accent"
            >
              Add Amenity
            </button>
          </div>
          {/* Display Selected Amenities */}
          <ul className="mt-2 space-y-1">
            {preferences.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-body">{amenity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      amenities: prev.amenities.filter((a) => a !== amenity),
                    }))
                  }
                  className="text-error hover:underline"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Preferences */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Preferences</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.mosques_nearby}
                onChange={() => handleCheckboxChange("mosques_nearby")}
              />
              <span className="text-body">Mosques Nearby</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.churches_nearby}
                onChange={() => handleCheckboxChange("churches_nearby")}
              />
              <span className="text-body">Churches Nearby</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.job_opportunities}
                onChange={() => handleCheckboxChange("job_opportunities")}
              />
              <span className="text-body">Job &amp; Career Opportunities</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.quality_of_life}
                onChange={() => handleCheckboxChange("quality_of_life")}
              />
              <span className="text-body">Quality of Life &amp; Social Factors</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.cost_of_living}
                onChange={() => handleCheckboxChange("cost_of_living")}
              />
              <span className="text-body">Cost of Living</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.public_transport}
                onChange={() => handleCheckboxChange("public_transport")}
              />
              <span className="text-body">Public Transport Availability</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.safety}
                onChange={() => handleCheckboxChange("safety")}
              />
              <span className="text-body">Safety &amp; Low Crime Rate</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.education_quality}
                onChange={() => handleCheckboxChange("education_quality")}
              />
              <span className="text-body">High-Quality Education</span>
            </label>
          </div>
        </div>

        {/* Button to fetch follow-up questions */}
        <button
          type="button"
          onClick={fetchFollowUpQuestions}
          className="px-4 py-2 bg-secondary text-white rounded"
        >
          Refine Recommendations (Get Follow-Up Questions)
        </button>

        {loadingFollowUp && <p>Loading follow-up questions...</p>}
        {followUpError && <p className="text-red-500">{followUpError}</p>}

        {/* Render follow-up questions dynamically */}
        {followUpQuestions.length > 0 && (
          <div>
            <h3>Follow-Up Questions:</h3>
            {followUpQuestions.map((question, index) => (
              <div key={index}>
                <label>{question}</label>
                <input
                  type="text"
                  onChange={(e) =>
                    handleQuestionResponse(index.toString(), e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}
        

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-primary text-surface rounded shadow-medium hover:bg-accent"
        >
          Find Countries
        </button>
      </form>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Preferences;
