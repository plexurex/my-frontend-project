"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const RecommendationForm = () => {
  const router = useRouter();

  // States for countries & cities
  const [countries, setCountries] = useState<
    { name: string; average_salary: number }[] 
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  // Form data state with new gender and age fields
  const [formData, setFormData] = useState({
    country_name: "",
    city_name: "",
    safety_rating: 3,
    food_price_rating: 3,
    culture_rating: 3,
    affordability_rating: 3,
    accessibility_rating: 3,
    quality_of_life_rating: 3,
    user_name: "",
    gender: "", // New field for gender
    age: "" // New field for age
  });

  // UI states
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchCountries();
  }, []);

  // Fetch available countries
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
      console.error("Error loading countries:", err);
    }
  };

  
  // Fetch cities when a country is selected
  const fetchCities = async (countryName: string) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/countries/${encodeURIComponent(countryName)}/cities/`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await res.json();
      if (data.cities) {
        setCities(data.cities.map((city: any) => city.name || city));
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error("Error loading cities:", err);
      setCities([]);
    }
  };

  // Handle country selection
  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setFormData({
      ...formData,
      country_name: countryName,
      city_name: "",
    });
    setSelectedCity("");
    fetchCities(countryName);
  };

  // Handle city selection
  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setFormData({
      ...formData,
      city_name: cityName,
    });
  };

  // Handle general form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle gender selection
  const handleGenderSelect = (gender: string) => {
    setFormData({
      ...formData,
      gender: gender,
    });
  };

  // Handle slider changes for ratings
  const handleSliderChange = (name: string, value: number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Reset form after successful submission
  const resetForm = () => {
    setFormData({
      country_name: "",
      city_name: "",
      safety_rating: 3,
      food_price_rating: 3,
      culture_rating: 3,
      affordability_rating: 3,
      accessibility_rating: 3,
      quality_of_life_rating: 3,
      user_name: "",
      gender: "",
      age: ""
    });
    setSelectedCountry("");
    setSelectedCity("");
    setSuccess(false);
    setActiveStep(1);
    setSubmitError("");
  };

  // Step navigation
  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  // Validate current step
  const validateCurrentStep = () => {
    if (activeStep === 1) {
      return !!selectedCountry && !!selectedCity;
    }
    if (activeStep === 2) {
      // All ratings are set to default values already
      return true;
    }
    if (activeStep === 3) {
      return !!formData.user_name.trim() && !!formData.gender;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setSubmitError("");
    
    const formDataToSubmit = new FormData();

    // Append all fields to formData (removed image handling)
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData];
      formDataToSubmit.append(key, value.toString());
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/submit-user-recommendation/", {
        method: "POST",
        body: formDataToSubmit, // Let browser set the multipart/form-data header
      });
      const result = await response.json();
      
      if (response.ok) {
        setSuccess(true);
      } else {
        setSubmitError(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting recommendation:", error);
      setSubmitError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render rating input with visual stars
  const RatingInput = ({ name, value, onChange, label }: { 
    name: string; 
    value: number;
    onChange: (name: string, value: number) => void;
    label: string;
  }) => {
    return (
      <div className="mb-6">
        <label className="block text-primary font-medium mb-2">{label}</label>
        <div className="flex items-center">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(name, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex ml-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} onClick={() => onChange(name, star)} className="cursor-pointer">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={star <= value ? "#F97316" : "#E2E8F0"} 
                  className="w-6 h-6"
                >
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </div>
            ))}
            <span className="ml-2 text-lg font-semibold text-primary">{value}/5</span>
          </div>
        </div>
        {/* Add labels for clarity */}
        <div className="flex justify-between mt-2 text-sm text-subdued">
          <span>1 - Poor</span>
          <span>5 - Excellent</span>
        </div>
      </div>
    );
  };

  // Success view
  if (success) {
    return (
      <div className={`container mx-auto px-6 py-12 max-w-2xl ${mounted ? 'animate-fade-in' : ''}`}>
        <div className="bg-surface p-8 rounded-xl shadow-medium text-center">
          <div className="w-20 h-20 mx-auto bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-h2 font-heading text-primary mb-3">Thank You!</h1>
          <p className="text-body text-subdued mb-8">
            Your recommendation for {formData.city_name}, {formData.country_name} has been submitted successfully. 
            Your insights will help others in their migration journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition transform hover:-translate-y-1"
            >
              Share Another Recommendation
            </button>
            <Link href="/user-recommendations">
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition transform hover:-translate-y-1">
                View All Recommendations
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-6 py-8 ${mounted ? 'animate-fade-in' : ''}`}>
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">Share Your Experience</h1>
        <p className="text-center mt-2 opacity-90">Help others by recommending cities you've visited</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-10 px-2 relative">
          <div className="h-1 bg-gray-200 absolute w-[85%] left-[7.5%] z-0 top-[40%] -translate-y-1/2"></div>
          
          {[
            { step: 1, label: 'Location' },
            { step: 2, label: 'Ratings' },
            { step: 3, label: 'Details' }
          ].map(({ step, label }) => (
            <div key={step} className="flex flex-col items-center z-10 relative">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                  ${activeStep >= step 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'}`}
              >
                {step}
              </div>
              <span className={`mt-2 text-sm ${activeStep >= step ? 'text-primary font-semibold' : 'text-subdued'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl shadow-medium">
          {/* Step 1: Location Selection */}
          <div className={activeStep === 1 ? 'block' : 'hidden'}>
            <h2 className="text-h3 font-heading text-primary mb-8 text-center">Where Have You Been?</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-primary font-medium mb-2">Select Country<span className="text-error">*</span></label>
                <select
                  className="w-full border border-subdued p-3 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
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
                <label className="block text-primary font-medium mb-2">Select City<span className="text-error">*</span></label>
                <select
                  className="w-full border border-subdued p-3 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  value={selectedCity}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  required
                  disabled={!selectedCountry}
                >
                  <option value="">-- Choose a city --</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {!selectedCountry && (
                  <p className="mt-2 text-sm text-subdued italic">Select a country first</p>
                )}
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Rate Your Experience
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Step 2: Ratings */}
          <div className={activeStep === 2 ? 'block' : 'hidden'}>
            <h2 className="text-h3 font-heading text-primary mb-8 text-center">Rate Your Experience in {selectedCity}</h2>
            
            <div className="space-y-3">
              <RatingInput 
                name="safety_rating" 
                value={formData.safety_rating} 
                onChange={handleSliderChange} 
                label="Safety" 
              />
              
              <RatingInput 
                name="food_price_rating" 
                value={formData.food_price_rating} 
                onChange={handleSliderChange} 
                label="Food Price" 
              />
              
              <RatingInput 
                name="culture_rating" 
                value={formData.culture_rating} 
                onChange={handleSliderChange} 
                label="Culture & Entertainment" 
              />
              
              <RatingInput 
                name="affordability_rating" 
                value={formData.affordability_rating} 
                onChange={handleSliderChange} 
                label="Overall Affordability" 
              />
              
              <RatingInput 
                name="accessibility_rating" 
                value={formData.accessibility_rating} 
                onChange={handleSliderChange} 
                label="Public Transportation & Accessibility" 
              />
              
              <RatingInput 
                name="quality_of_life_rating" 
                value={formData.quality_of_life_rating} 
                onChange={handleSliderChange} 
                label="Overall Quality of Life" 
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center"
              >
                Next: Final Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Step 3: User Details */}
          <div className={activeStep === 3 ? 'block' : 'hidden'}>
            <h2 className="text-h3 font-heading text-primary mb-8 text-center">Almost Done!</h2>
            
            <div className="space-y-6">
              {/* New Gender Selection */}
              <div className="mb-6">
                <label className="block text-primary font-medium mb-2">Gender<span className="text-error">*</span></label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="Male" 
                      checked={formData.gender === 'Male'}
                      onChange={() => handleGenderSelect('Male')}
                      className="form-radio text-primary"
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="Female" 
                      checked={formData.gender === 'Female'}
                      onChange={() => handleGenderSelect('Female')}
                      className="form-radio text-primary"
                    />
                    <span className="ml-2">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="Other" 
                      checked={formData.gender === 'Other'}
                      onChange={() => handleGenderSelect('Other')}
                      className="form-radio text-primary"
                    />
                    <span className="ml-2">Other</span>
                  </label>
                </div>
              </div>

              {/* New Age Input */}
              <div className="mb-6">
                <label htmlFor="age" className="block text-primary font-medium mb-2">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  className="w-full border border-subdued p-3 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <label htmlFor="user_name" className="block text-primary font-medium mb-2">Your Name<span className="text-error">*</span></label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="Your name or nickname"
                  className="w-full border border-subdued p-3 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  required
                />
                <p className="mt-1 text-xs text-subdued">This will be displayed alongside your recommendation</p>
              </div>
              
              {submitError && (
                <div className="bg-error/10 border-l-4 border-error p-4 rounded-lg">
                  <p className="text-error">{submitError}</p>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !validateCurrentStep()}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-t-2 border-r-2 border-white border-opacity-50 rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Recommendation
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
        
        {/* Summary Preview */}
        {activeStep > 1 && selectedCity && (
          <div className="mt-8 bg-background p-6 rounded-xl border border-subdued/30">
            <h3 className="text-h5 font-heading text-primary mb-4">Your Recommendation Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-subdued mb-1">Location</p>
                <p className="font-medium">{selectedCity}, {selectedCountry}</p>
              </div>
              
              {activeStep > 2 && (
                <div>
                  <p className="text-sm text-subdued mb-1">Average Rating</p>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F97316" className="w-5 h-5 mr-1">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">
                      {(
                        (formData.safety_rating +
                        formData.food_price_rating +
                        formData.culture_rating +
                        formData.affordability_rating +
                        formData.accessibility_rating +
                        formData.quality_of_life_rating) / 6
                      ).toFixed(1)}
                      /5
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationForm;