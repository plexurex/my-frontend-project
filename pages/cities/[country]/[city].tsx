// pages/cities/[city].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CityDetails = () => {
    const router = useRouter();
    const { city } = router.query;
    const [details, setDetails] = useState({});

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
        <div>
            <h1>Details for {city}</h1>
            <p>Population: {details.population}</p>
            <p>Area: {details.area}</p>
            <p>Average Rent: {details.average_rent}</p>
            {/* More details can be added here */}
        </div>
    );
};

export default CityDetails;
