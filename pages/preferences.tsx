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

    // List of all available amenities from JSON file
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
        <div>
            <h1>Set Your Preferences</h1>
            <form onSubmit={handleSubmit}>

                {/* Rent & Salary Inputs */}
                <label>
                    Maximum Rent (USD):
                    <input
                        type="number"
                        value={preferences.rent}
                        onChange={(e) =>
                            setPreferences({ ...preferences, rent: e.target.value })
                        }
                    />
                </label>
                <br />
                <label>
                    Minimum Salary (USD):
                    <input
                        type="number"
                        value={preferences.salary}
                        onChange={(e) =>
                            setPreferences({ ...preferences, salary: e.target.value })
                        }
                    />
                </label>
                <br />

                {/* Desired Amenities Selection */}
                <label>
                    Desired Amenities:
                    <select
                        value={selectedAmenity}
                        onChange={(e) => setSelectedAmenity(e.target.value)}
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
                    >
                        Add Amenity
                    </button>
                </label>

                {/* Display Selected Amenities */}
                <ul>
                    {preferences.amenities.map((amenity, index) => (
                        <li key={index}>
                            {amenity}{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    setPreferences((prev) => ({
                                        ...prev,
                                        amenities: prev.amenities.filter((a) => a !== amenity),
                                    }))
                                }
                            >
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>

                <h3>Additional Preferences</h3>
                {/* Additional Preferences (Checkboxes) */}
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.mosques_nearby}
                        onChange={() => handleCheckboxChange("mosques_nearby")}
                    />
                    Mosques Nearby
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.churches_nearby}
                        onChange={() => handleCheckboxChange("churches_nearby")}
                    />
                    Churches Nearby
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.job_opportunities}
                        onChange={() => handleCheckboxChange("job_opportunities")}
                    />
                    Job & Career Opportunities
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.quality_of_life}
                        onChange={() => handleCheckboxChange("quality_of_life")}
                    />
                    Quality of Life & Social Factors
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.cost_of_living}
                        onChange={() => handleCheckboxChange("cost_of_living")}
                    />
                    Cost of Living
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.public_transport}
                        onChange={() => handleCheckboxChange("public_transport")}
                    />
                    Public Transport Availability
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.safety}
                        onChange={() => handleCheckboxChange("safety")}
                    />
                    Safety & Low Crime Rate
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={preferences.education_quality}
                        onChange={() => handleCheckboxChange("education_quality")}
                    />
                    High-Quality Education
                </label>
                <br />

                <button type="submit">Find Countries</button>
            </form>
        </div>
    );
};

export default Preferences;
