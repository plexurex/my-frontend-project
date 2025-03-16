import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const CityDetails = () => {
  const router = useRouter();
  const { cityName } = router.query;
  const [cityDetails, setCityDetails] = useState<any>({});
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <p>Loading city details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!cityDetails || Object.keys(cityDetails).length === 0) return <p>No details available for this city.</p>;

  return (
    <div>
      <h1>Details for {cityName}</h1>
      <div>
        <p><strong>Population:</strong> {cityDetails.population}</p>
        <p><strong>Average Rent:</strong> {cityDetails.average_rent}</p>
        <p><strong>Average Salary:</strong> {cityDetails.average_salary}</p>
        <p><strong>Cost of Living Index:</strong> {cityDetails.cost_of_living_index}</p>
        <p><strong>Safety Index:</strong> {cityDetails.safety_index}</p>
        <p><strong>Quality of Life Index:</strong> {cityDetails.quality_of_life_index}</p>
        <p><strong>Healthcare Index:</strong> {cityDetails.healthcare_index}</p>
        <p><strong>Education Index:</strong> {cityDetails.education_index}</p>
        <p><strong>Job Availability Score:</strong> {cityDetails.job_availability_score}</p>
        <p><strong>Public Transport Score:</strong> {cityDetails.public_transport_score}</p>
        <p>
          <strong>Amenities:</strong>{" "}
          {cityDetails.amenities_available && cityDetails.amenities_available.length > 0
            ? cityDetails.amenities_available.join(", ")
            : "N/A"}
        </p>
        {cityDetails.weather && (
          <div>
            <p><strong>Weather Details:</strong></p>
            <p>Average Temperature: {cityDetails.weather.average_temperature}</p>
            <p>Humidity: {cityDetails.weather.humidity}%</p>
            <p>Extreme Weather: {cityDetails.weather.extreme_weather_conditions}</p>
          </div>
        )}
      </div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={location}
        >
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default CityDetails;
