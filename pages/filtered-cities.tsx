import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const FilteredCities = () => {
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const { rent, salary, amenities } = router.query;

  useEffect(() => {
    if (rent && salary && amenities) {
      const params = new URLSearchParams({
        rent: rent.toString(),
        salary: salary.toString(),
        amenities: Array.isArray(amenities) ? amenities.join(',') : amenities,
      });

      fetch(`http://127.0.0.1:8000/api/filter-cities/?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Failed to fetch filtered cities", err));
    }
  }, [rent, salary, amenities]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-h1 font-heading mb-4">Recommended Cities</h1>
      <ul className="space-y-4">
        {cities.length > 0 ? (
          cities.map((city, index) => (
            <li key={index} className="bg-surface p-4 rounded-medium shadow-subtle">
              <span className="text-body">
                {city.name} - Rent: {city.rent} USD, Salary: {city.salary} USD
              </span>
            </li>
          ))
        ) : (
          <p className="text-body text-subdued">No cities match your preferences.</p>
        )}
      </ul>
    </div>
  );
};

export default FilteredCities;
