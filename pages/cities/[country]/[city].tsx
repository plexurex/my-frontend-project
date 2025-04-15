import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CityDetails = () => {
  const router = useRouter();
  const { city } = router.query;
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    if (city) {
      fetch(`http://127.0.0.1:8000/api/city-details/${city}/`)
        .then(response => response.json())
        .then(data => {
          setDetails(data);
        })
        .catch(error => console.error('Failed to load city details', error));
    }
  }, [city]);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-surface p-6 rounded-medium shadow-medium">
        <h1 className="text-h1 font-heading mb-4">Details for {city}</h1>
        <p className="text-body mb-2">Population: {details.population}</p>
        <p className="text-body mb-2">Area: {details.area}</p>
        <p className="text-body mb-2">Average Rent: {details.average_rent}</p>
        {/* More details can be added here */}
      </div>
    </div>
  );
};

export default CityDetails;
