"use client";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Link from 'next/link';

// Modal Component for Recommendation
const RecommendationModal = ({ cityName, onClose }: { cityName: string, onClose: () => void }) => {
  const [rating, setRating] = useState(3);
  const [feedback, setFeedback] = useState('');
  const [relevance, setRelevance] = useState(3);
  const [experience, setExperience] = useState(3);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [importantPreference, setImportantPreference] = useState('Safety'); // default value
 // New state variables
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [recommendToOthers, setRecommendToOthers] = useState('');
  const [lengthOfStay, setLengthOfStay] = useState('');

  const preferenceOptions = ["Safety", "Cost of Living", "Quality of Life", "Healthcare", "Education"];
  const ageRanges = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65 or over"];
  const recommendationOptions = ["Yes", "No", "Maybe"];
  const stayLengthOptions = ["Never visited", "Less than a month", "1-6 months", "6-12 months", "1-3 years", "3+ years"];
  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/submit-recommendation-feedback/", {
      method: "POST",
      body: JSON.stringify({
        city: cityName,
        rating,
        relevance,
        experience,
        additional_feedback: additionalFeedback,
        important_preference: importantPreference,
        gender,
        age,
        recommend_to_others: recommendToOthers,
        length_of_stay: lengthOfStay
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      alert('Thank you for your feedback!');
      onClose();
    } else {
      alert('Error submitting feedback');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-h3 font-heading text-primary mb-6 text-center">Rate {cityName}</h2>

        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Gender</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="Male" 
                checked={gender === 'Male'}
                onChange={() => setGender('Male')}
                className="form-radio text-primary"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="Female" 
                checked={gender === 'Female'}
                onChange={() => setGender('Female')}
                className="form-radio text-primary"
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="Other" 
                checked={gender === 'Other'}
                onChange={() => setGender('Other')}
                className="form-radio text-primary"
              />
              <span className="ml-2">Other</span>
            </label>
          </div>
        </div>

        {/* Age Range Dropdown */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Age Range</label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select your age range</option>
            {ageRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <p className="text-body mb-2 font-medium">How relevant is this recommendation?</p>
          <StarRating value={relevance} onChange={setRelevance} />
        </div>

        <div className="mb-6">
          <p className="text-body mb-2 font-medium">How was your overall experience?</p>
          <StarRating value={experience} onChange={setExperience} />
        </div>

        {/* Would you recommend this city */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Would you recommend this city to other migrants?</label>
          <select
            value={recommendToOthers}
            onChange={(e) => setRecommendToOthers(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select an option</option>
            {recommendationOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {/* Length of stay */}
        <div className="mb-6">
          <label className="block font-medium mb-2">How long have you lived or stayed in this city?</label>
          <select
            value={lengthOfStay}
            onChange={(e) => setLengthOfStay(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select an option</option>
            {stayLengthOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Additional Feedback (Optional):</label>
          <textarea
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
            rows={4}
            placeholder="Share your thoughts about this city recommendation..."
          />
        </div>

        <div className="mb-8">
          <label className="block font-medium mb-2">Which of these matters most to you?</label>
          <select
            value={importantPreference}
            onChange={(e) => setImportantPreference(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {preferenceOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Star Rating Component for rating relevance, experience, etc.
const StarRating = ({ value, onChange }: { value: number, onChange: (rating: number) => void }) => {
  const handleStarClick = (index: number) => {
    onChange(index);
  };

  return (
    <div className="flex space-x-2">
      {[...Array(5)].map((_, index) => {
        const starClass = index < value ? 'text-yellow-500' : 'text-gray-300';
        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            className={`cursor-pointer transition-colors hover:text-yellow-400 ${starClass}`}
            onClick={() => handleStarClick(index + 1)}
          >
            <path d="M12 .587l3.668 7.429 8.232 1.143-6 5.85 1.416 8.251-7.316-3.85-7.318 3.85 1.416-8.251-6-5.85 8.232-1.143L12 .587z" />
          </svg>
        );
      })}
      <span className="ml-2 text-lg">{value}/5</span>
    </div>
  );
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

// City Photo Carousel component
const CityPhotoCarousel = ({ cityName }: { cityName: string }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cityName) return;
    const fetchPhotos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            cityName
          )}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        );
        if (!res.ok) {
          throw new Error(`Error fetching photos: ${res.status}`);
        }
        const data = await res.json();
        setPhotos(data.results);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching photos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [cityName]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-80 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-error/10 text-error p-6 rounded-lg">
      <p>{error}</p>
    </div>
  );
  
  if (photos.length === 0) return (
    <div className="bg-skyblue/10 text-skyblue p-6 rounded-lg">
      <p>No photos found for {cityName}.</p>
    </div>
  );

  return (
    <div className="relative h-[500px] bg-gray-100 rounded-xl overflow-hidden">
      <img
        src={photos[currentPhotoIndex].urls.regular}
        alt={photos[currentPhotoIndex].alt_description || cityName}
        className="w-full h-full object-cover"
      />
      
     
      {/* Navigation buttons */}
      <button 
        onClick={prevPhoto} 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
        aria-label="Previous photo"
        style={{ transform: 'translateY(-50%)', pointerEvents: 'auto' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={nextPhoto} 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
        aria-label="Next photo"
        style={{ transform: 'translateY(-50%)', pointerEvents: 'auto' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Photo count indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentPhotoIndex + 1} / {photos.length}
      </div>
      
      {/* Photo description */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <p className="text-white text-sm md:text-base">
          {photos[currentPhotoIndex].description || photos[currentPhotoIndex].alt_description || `${cityName} cityscape`}
        </p>
        <p className="text-white/70 text-xs">
          Photo by{" "}
          <a href={photos[currentPhotoIndex].user.links.html} target="_blank" rel="noopener noreferrer" className="underline">
            {photos[currentPhotoIndex].user.name}
          </a>
          {" "}on{" "}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
};

// Main component
const CityDetails = () => {
  const router = useRouter();
  const { cityName } = router.query;
  const [cityDetails, setCityDetails] = useState<any>({});
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (cityName) {
      fetch(`http://127.0.0.1:8000/api/city-details/${encodeURIComponent(cityName as string)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error fetching city details: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setCityDetails(data);
          if (data.latitude && data.longitude) {
            setLocation({ lat: data.latitude, lng: data.longitude });
          }
        })
        .catch((err) => {
          console.error('Failed to fetch city details:', err);
          setError('Failed to fetch city details. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [cityName]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-subdued">Loading details for {cityName}...</p>
      </div>
    );
    
  if (error)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-error/10 border-l-4 border-error p-6 rounded-lg">
          <p className="text-body text-error">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
    
  if (!cityDetails || Object.keys(cityDetails).length === 0)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-skyblue/10 border-l-4 border-skyblue p-6 rounded-lg text-center">
          <p className="text-body">No details available for {cityName}.</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const handleFeedbackButtonClick = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  return (
    <div className={`container mx-auto px-6 py-8 ${mounted ? 'animate-fade-in' : ''}`}>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Link 
          href="/search-country"
          className="inline-flex items-center text-primary hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Search
        </Link>
        
        <div className="flex-grow">
          <h1 className="text-h1 font-heading text-primary">{cityName}</h1>
          <p className="text-subdued">{cityDetails.country}</p>
        </div>
        
        <button
          onClick={handleFeedbackButtonClick}
          className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg flex items-center shadow-md transform transition hover:-translate-y-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Rate Recommendation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - City Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface p-6 rounded-xl shadow-medium">
            <h2 className="text-h4 font-heading text-primary mb-4 border-b pb-2">City Statistics</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Population</div>
                  <div className="font-bold text-lg">{cityDetails.population?.toLocaleString() || 'N/A'}</div>
                </div>
                
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Safety Index</div>
                  <div className="font-bold text-lg">{cityDetails.safety_index || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Avg. Salary</div>
                  <div className="font-bold text-lg">${cityDetails.average_salary?.toLocaleString() || 'N/A'}</div>
                </div>
                
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Avg. Rent</div>
                  <div className="font-bold text-lg">${cityDetails.average_rent?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">QoL Index</div>
                  <div className="font-bold text-lg">{cityDetails.quality_of_life_index || 'N/A'}</div>
                </div>
                
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Healthcare</div>
                  <div className="font-bold text-lg">{cityDetails.healthcare_index || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Education</div>
                  <div className="font-bold text-lg">{cityDetails.education_index || 'N/A'}</div>
                </div>
                
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Cost of Living</div>
                  <div className="font-bold text-lg">{cityDetails.cost_of_living_index || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Job Availability</div>
                  <div className="font-bold text-lg">{cityDetails.job_availability_score || 'N/A'}</div>
                </div>
                
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-sm text-subdued">Public Transport</div>
                  <div className="font-bold text-lg">{cityDetails.public_transport_score || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Weather Panel */}
          {cityDetails.weather && (
            <div className="bg-surface p-6 rounded-xl shadow-medium">
              <h2 className="text-h4 font-heading text-primary mb-4 border-b pb-2">Weather</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-subdued">Average Temperature</span>
                  <span className="font-medium">{cityDetails.weather.average_temperature}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-subdued">Humidity</span>
                  <span className="font-medium">{cityDetails.weather.humidity}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-subdued">Extreme Weather</span>
                  <span className="font-medium">{cityDetails.weather.extreme_weather_conditions}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Amenities Panel */}
          <div className="bg-surface p-6 rounded-xl shadow-medium">
            <h2 className="text-h4 font-heading text-primary mb-4 border-b pb-2">Available Amenities</h2>
            
            {cityDetails.amenities_available?.length ? (
              <div className="flex flex-wrap gap-2">
                {cityDetails.amenities_available.map((amenity: string, idx: number) => (
                  <span key={idx} className="bg-background px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-subdued italic">No amenity data available</p>
            )}
          </div>
        </div>
        
        {/* Right Column - Photo and Map */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Carousel */}
          <div className="bg-surface p-6 rounded-xl shadow-medium">
            <h2 className="text-h4 font-heading text-primary mb-4">Photo Gallery</h2>
            <CityPhotoCarousel cityName={cityName as string} />
          </div>
          
          {/* Google Map */}
          <div className="bg-surface p-6 rounded-xl shadow-medium">
            <h2 className="text-h4 font-heading text-primary mb-4">Location</h2>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <GoogleMap 
                mapContainerStyle={mapContainerStyle} 
                zoom={12} 
                center={location}
                options={{
                  streetViewControl: true,
                  mapTypeControl: true,
                }}
              >
                <Marker position={location} />
              </GoogleMap>
            </LoadScript>
            <p className="mt-3 text-sm text-subdued">
              Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
          
          {/* Similar Cities Section (if available) */}
          {cityDetails.similar_cities?.length > 0 && (
            <div className="bg-surface p-6 rounded-xl shadow-medium">
              <h2 className="text-h4 font-heading text-primary mb-4">Similar Cities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cityDetails.similar_cities.map((city: string, idx: number) => (
                  <Link 
                    key={idx} 
                    href={`/city-details/${encodeURIComponent(city)}`}
                    className="bg-background p-3 rounded-lg hover:shadow-md transition-all text-center hover:bg-primary/5"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Conditionally render the feedback form */}
      {showFeedbackForm && (
        <RecommendationModal cityName={cityName as string} onClose={() => setShowFeedbackForm(false)} />
      )}
    </div>
  );
};

export default CityDetails;