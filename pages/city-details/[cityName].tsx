"use client";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Modal Component for Recommendation
const RecommendationModal = ({ cityName, onClose }: { cityName: string, onClose: () => void }) => {
  const [rating, setRating] = useState(3);  // Default rating is 3
  const [feedback, setFeedback] = useState('');
  const [relevance, setRelevance] = useState(3); // Rating for relevance
  const [experience, setExperience] = useState(3); // Rating for overall experience
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/submit-recommendation-feedback/", {
      method: "POST",
      body: JSON.stringify({
        city: cityName,
        rating,
        relevance,
        experience,
        additional_feedback: additionalFeedback,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      alert('Thank you for your feedback!');
      onClose();  // Close the modal after submission
    } else {
      alert('Error submitting feedback');
    }
  };
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Rate the Recommendation for {cityName}</h2>

        {/* Rating Section: User Recommendation */}
        <div>
          <p>How relevant is this recommendation?</p>
          <StarRating value={relevance} onChange={setRelevance} />
        </div>

        {/* Experience Section: Overall Experience */}
        <div>
          <p>How was your overall experience with this city recommendation?</p>
          <StarRating value={experience} onChange={setExperience} />
        </div>

        {/* Feedback Section */}
        <div>
          <label>Additional Feedback (Optional): </label>
          <textarea
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            className="w-full"
          />
        </div>

        <button onClick={handleSubmit}>Submit Feedback</button>
        <button onClick={onClose}>Cancel</button>
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
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const starClass = index < value ? 'text-yellow-500' : 'text-gray-300';
        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className={`cursor-pointer ${starClass}`}
            onClick={() => handleStarClick(index + 1)}
          >
            <path d="M12 .587l3.668 7.429 8.232 1.143-6 5.85 1.416 8.251-7.316-3.85-7.318 3.85 1.416-8.251-6-5.85 8.232-1.143L12 .587z" />
          </svg>
        );
      })}
    </div>
  );
};

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

// City Photo Album component that fetches photos from Unsplash API
const CityPhotoAlbum = ({ cityName }: { cityName: string }) => {
  const [photos, setPhotos] = useState<any[]>([]);
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

  if (loading) return <p>Loading photos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (photos.length === 0) return <p>No photos found for {cityName}.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.urls.small}
          alt={photo.alt_description || cityName}
          className="rounded shadow"
        />
      ))}
    </div>
  );
};

const CityDetails = () => {
  const router = useRouter();
  const { cityName } = router.query;
  const [cityDetails, setCityDetails] = useState<any>({});
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false); // State to manage showing feedback form

  useEffect(() => {
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
    return <p className="text-body text-center">Loading city details...</p>;
  if (error)
    return <p className="text-body text-error text-center">{error}</p>;
  if (!cityDetails || Object.keys(cityDetails).length === 0)
    return <p className="text-body text-center">No details available for this city.</p>;

  const handleFeedbackButtonClick = () => {
    setShowFeedbackForm(!showFeedbackForm); // Toggle the visibility of the feedback form
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-surface p-6 rounded-medium shadow-medium relative">
        <h1 className="text-h1 font-heading mb-4">Details for {cityName}</h1>

        {/* Add "Give Feedback" Button positioned inside the city details box */}
        <button
          onClick={handleFeedbackButtonClick}
          className="absolute top-4 right-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 z-10"
        >
          Give Feedback on This City
        </button>

        <div className="space-y-2 mb-4">
          <p className="text-body"><strong>Population:</strong> {cityDetails.population}</p>
          <p className="text-body"><strong>Average Rent:</strong> {cityDetails.average_rent}</p>
          <p className="text-body"><strong>Average Salary:</strong> {cityDetails.average_salary}</p>
          <p className="text-body"><strong>Cost of Living Index:</strong> {cityDetails.cost_of_living_index}</p>
          <p className="text-body"><strong>Safety Index:</strong> {cityDetails.safety_index}</p>
          <p className="text-body"><strong>Quality of Life Index:</strong> {cityDetails.quality_of_life_index}</p>
          <p className="text-body"><strong>Healthcare Index:</strong> {cityDetails.healthcare_index}</p>
          <p className="text-body"><strong>Education Index:</strong> {cityDetails.education_index}</p>
          <p className="text-body"><strong>Job Availability Score:</strong> {cityDetails.job_availability_score}</p>
          <p className="text-body"><strong>Public Transport Score:</strong> {cityDetails.public_transport_score}</p>
          <p className="text-body"><strong>Amenities:</strong> {cityDetails.amenities_available?.length ? cityDetails.amenities_available.join(", ") : "N/A"}</p>
          {cityDetails.weather && (
            <div className="mt-4">
              <p className="text-body font-medium">Weather Details:</p>
              <p className="text-body">Average Temperature: {cityDetails.weather.average_temperature}</p>
              <p className="text-body">Humidity: {cityDetails.weather.humidity}%</p>
              <p className="text-body">Extreme Weather: {cityDetails.weather.extreme_weather_conditions}</p>
            </div>
          )}
        </div>

        {/* Google Maps */}
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={location}>
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
        
        {/* City Photo Album */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Photo Album</h2>
          <CityPhotoAlbum cityName={cityName as string} />
        </div>

        {/* Conditionally render the feedback form */}
        {showFeedbackForm && (
          <RecommendationModal cityName={cityName as string} onClose={() => setShowFeedbackForm(false)} />
        )}
      </div>
    </div>
  );
};

export default CityDetails;
