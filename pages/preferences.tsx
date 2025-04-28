"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';

const Preferences = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(1);
  const [mounted, setMounted] = useState(false);

  // User preferences state with budget and income tiers instead of specific values
  const [preferences, setPreferences] = useState({
    budgetTier: "medium", // "low", "medium", "high"
    incomeTier: "medium", // "low", "medium", "high"
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
    "Airports",
    "Banks/ATMs",
    "Beaches",
    "Cafes",
    "Colonial Architecture",
    "Community Centers",
    "Convenience Stores",
    "Cultural Centers",
    "Cultural Sites",
    "Educational Institutions",
    "Entertainment Districts",
    "Fire Stations",
    "Gyms",
    "Harbor",
    "Historic Sites",
    "Hospitals",
    "Hotels",
    "Imperial Palaces",
    "Landmarks",
    "Libraries",
    "Local Markets",
    "Local Restaurants",
    "Luxury Resorts",
    "Markets",
    "Mosques",
    "Mountains",
    "Museums",
    "Music Venues",
    "Nightlife",
    "Opera Houses",
    "Parks",
    "Ports",
    "Post Offices",
    "Public Libraries",
    "Public Transport",
    "Pyramids",
    "Restaurants",
    "Resort Beaches",
    "Security Services",
    "Shopping Centers",
    "Shopping Districts",
    "Souks",
    "Temples",
    "Theaters",
  ];
  

  const [selectedAmenity, setSelectedAmenity] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

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
  
    // Create URLSearchParams
    const params = new URLSearchParams();
    
    // Add budget and income tiers
    params.set('budgetTier', preferences.budgetTier);
    params.set('incomeTier', preferences.incomeTier);
    
    // Add amenities as a comma-separated list
    if (preferences.amenities.length > 0) {
      params.set('amenities', preferences.amenities.join(','));
    }
    
    // Add all boolean preferences that are true
    Object.entries(preferences).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value) {
        params.set(key, 'true');
      }
    });
    
    // Add all follow-up responses
    if (Object.keys(userResponses).length > 0) {
      params.set('followup_responses', JSON.stringify(userResponses));
    }
    // Choose endpoint based on whether follow-up responses are present
    const endpoint = Object.keys(userResponses).length > 0 
      ? '/ml-recommendations' 
      : '/recommendations';
    
    // Navigate with the assembled params
    router.push(`${endpoint}?${params.toString()}`);
  };

  // Fetch follow-up questions based on current preferences
  const fetchFollowUpQuestions = async () => {
    setLoadingFollowUp(true);
    setFollowUpError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-followup-questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ preferences }),
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch follow-up questions: ${response.status}`);
      }

      const data = await response.json();
      setFollowUpQuestions(data.questions || []);
    } catch (err) {
      console.error("Error fetching follow-up questions:", err);
      setFollowUpError("Failed to fetch follow-up questions. Please try again.");
    } finally {
      setLoadingFollowUp(false);
    }
  };

  const handleQuestionResponse = (questionIndex: string, answer: string) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const nextSection = () => {
    setActiveSection(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevSection = () => {
    setActiveSection(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`container mx-auto px-6 py-8 ${mounted ? 'animate-fade-in' : ''}`}>
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">Set Your Preferences</h1>
        <p className="text-center mt-2 opacity-90">Help us find your perfect city match</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-10 px-2 relative">
          {/* Position the line properly */}
          <div className="h-1 bg-gray-200 absolute w-[85%] left-[7.5%] z-0 top-[40%] -translate-y-1/2"></div>
          
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center z-10 relative">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                  ${activeSection >= step 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'}`}
              >
                {step}
              </div>
              <span className={`mt-2 text-sm ${activeSection >= step ? 'text-primary font-semibold' : 'text-subdued'}`}>
                {step === 1 ? 'Basic Info' : step === 2 ? 'Amenities' : 'Preferences'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl shadow-medium">
          {/* Section 1: Basic Info */}
          <div className={`${activeSection === 1 ? 'block' : 'hidden'} space-y-8`}>
            <div className="text-center mb-8">
              <h2 className="text-h3 font-heading text-primary">Financial Preferences</h2>
              <p className="text-subdued">Let's start with your budget considerations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block font-medium text-primary mb-1">Cost of Living Preference:</label>
                <select
                  value={preferences.budgetTier}
                  onChange={(e) => setPreferences({ ...preferences, budgetTier: e.target.value })}
                  className="border border-subdued p-3 rounded-lg w-full focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                >
                  <option value="low">Budget-friendly (Lower cost cities)</option>
                  <option value="medium">Moderate (Average cost cities)</option>
                  <option value="high">Premium (Higher cost cities)</option>
                </select>
                <p className="text-xs text-subdued italic">Choose your preferred living cost range</p>
              </div>
              
              <div className="space-y-2">
                <label className="block font-medium text-primary mb-1">Income Expectation:</label>
                <select
                  value={preferences.incomeTier}
                  onChange={(e) => setPreferences({ ...preferences, incomeTier: e.target.value })}
                  className="border border-subdued p-3 rounded-lg w-full focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                >
                  <option value="low">Entry-level income</option>
                  <option value="medium">Mid-range income</option>
                  <option value="high">High income</option>
                </select>
                <p className="text-xs text-subdued italic">What income level are you expecting?</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={nextSection}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center"
              >
                Next Step
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Section 2: Amenities */}
          <div className={`${activeSection === 2 ? 'block' : 'hidden'} space-y-8`}>
            <div className="text-center mb-8">
              <h2 className="text-h3 font-heading text-primary">Desired Amenities</h2>
              <p className="text-subdued">Select amenities that matter to you</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-grow">
                  <select
                    value={selectedAmenity}
                    onChange={(e) => setSelectedAmenity(e.target.value)}
                    className="border border-subdued p-3 rounded-lg w-full focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  >
                    <option value="">Select an amenity</option>
                    {availableAmenities.map((amenity, index) => (
                      <option key={index} value={amenity}>
                        {amenity}
                      </option>
                    ))}
                  </select>
                </div>
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
                  className="px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition flex-shrink-0"
                >
                  Add Amenity
                </button>
              </div>
              
              {/* Selected Amenities */}
              <div className="mt-6">
                <h3 className="font-medium text-primary mb-3">Selected Amenities:</h3>
                {preferences.amenities.length === 0 ? (
                  <p className="text-subdued italic">No amenities selected yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {preferences.amenities.map((amenity, index) => (
                      <div 
                        key={index} 
                        className="bg-background rounded-full px-3 py-1 flex items-center group"
                      >
                        <span className="text-sm">{amenity}</span>
                        <button
                          type="button"
                          onClick={() => setPreferences((prev) => ({
                            ...prev,
                            amenities: prev.amenities.filter((a) => a !== amenity),
                          }))}
                          className="ml-2 text-subdued hover:text-error"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevSection}
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <button
                type="button"
                onClick={nextSection}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center"
              >
                Next Step
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Section 3: Additional Preferences */}
          <div className={`${activeSection === 3 ? 'block' : 'hidden'} space-y-8`}>
            <div className="text-center mb-8">
              <h2 className="text-h3 font-heading text-primary">Additional Preferences</h2>
              <p className="text-subdued">Fine-tune your city preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="bg-background p-4 rounded-lg hover:shadow-md transition-all">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.job_opportunities}
                    onChange={() => handleCheckboxChange("job_opportunities")}
                    className="form-checkbox text-accent rounded focus:ring-accent h-5 w-5"
                  />
                  <span>
                    <span className="font-medium">Job Opportunities</span>
                    <p className="text-xs text-subdued mt-0.5">Cities with strong job markets and career growth</p>
                  </span>
                </label>
              </div>
              
              <div className="bg-background p-4 rounded-lg hover:shadow-md transition-all">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.quality_of_life}
                    onChange={() => handleCheckboxChange("quality_of_life")}
                    className="form-checkbox text-accent rounded focus:ring-accent h-5 w-5"
                  />
                  <span>
                    <span className="font-medium">Quality of Life</span>
                    <p className="text-xs text-subdued mt-0.5">Focus on cities with high quality of living standards</p>
                  </span>
                </label>
              </div>
              
              <div className="bg-background p-4 rounded-lg hover:shadow-md transition-all">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.cost_of_living}
                    onChange={() => handleCheckboxChange("cost_of_living")}
                    className="form-checkbox text-accent rounded focus:ring-accent h-5 w-5"
                  />
                  <span>
                    <span className="font-medium">Cost of Living</span>
                    <p className="text-xs text-subdued mt-0.5">Emphasis on affordable living expenses</p>
                  </span>
                </label>
              </div>
              
              <div className="bg-background p-4 rounded-lg hover:shadow-md transition-all">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.public_transport}
                    onChange={() => handleCheckboxChange("public_transport")}
                    className="form-checkbox text-accent rounded focus:ring-accent h-5 w-5"
                  />
                  <span>
                    <span className="font-medium">Public Transport</span>
                    <p className="text-xs text-subdued mt-0.5">Good public transportation networks</p>
                  </span>
                </label>
              </div>
              
              <div className="bg-background p-4 rounded-lg hover:shadow-md transition-all">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.safety}
                    onChange={() => handleCheckboxChange("safety")}
                    className="form-checkbox text-accent rounded focus:ring-accent h-5 w-5"
                  />
                  <span>
                    <span className="font-medium">Safety</span>
                    <p className="text-xs text-subdued mt-0.5">Cities with low crime rates and high safety standards</p>
                  </span>
                </label>
              </div>
              
              <div className="bg-background p-4 rounded-lg hover:shadow-md transition-all">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.education_quality}
                    onChange={() => handleCheckboxChange("education_quality")}
                    className="form-checkbox text-accent rounded focus:ring-accent h-5 w-5"
                  />
                  <span>
                    <span className="font-medium">Education Quality</span>
                    <p className="text-xs text-subdued mt-0.5">Access to high-quality schools and universities</p>
                  </span>
                </label>
              </div>
            </div>
            
            {/* Refinement Section */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-h5 font-heading text-primary mb-4">Want more tailored recommendations?</h3>
              
              <button
                type="button"
                onClick={fetchFollowUpQuestions}
                className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition flex items-center mb-4"
                disabled={loadingFollowUp}
              >
                {loadingFollowUp ? (
                  <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Loading...</>
                ) : (
                  <>Get Follow-Up-Questions</>
                )}
              </button>
              
              {followUpError && <p className="text-error text-sm mb-4">{followUpError}</p>}
              
              {/* Follow-up questions */}
              {followUpQuestions.length > 0 && (
                <div className="space-y-4 mt-6 p-4 bg-background rounded-lg">
                  <h3 className="text-h5 font-heading text-primary">Follow-Up Questions:</h3>
                  {followUpQuestions.map((question, index) => (
                    <div key={index} className="bg-surface p-3 rounded-lg">
                      <label className="block text-primary mb-2">{question}</label>
                      <input
                        type="text"
                        onChange={(e) => handleQuestionResponse(index.toString(), e.target.value)}
                        className="border border-subdued p-2 rounded-lg w-full focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        placeholder="Your answer..."
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevSection}
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition flex items-center"
              >
                Find My Perfect City
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </form>
        
        {error && <p className="text-error text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Preferences;