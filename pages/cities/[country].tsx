"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CityDisplay() {
  const router = useRouter();
  const { country } = router.query;
  const [cities, setCities] = useState<any[]>([]);
  const [salary, setSalary] = useState<number | null>(null);

  useEffect(() => {
    if (country) {
      // Fetch country details
      fetch("http://127.0.0.1:8000/api/countries/")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP status ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          const selectedCountry = data.find((c: any) => c.name === country);
          if (selectedCountry) {
            setSalary(selectedCountry.average_salary);
          }
        })
        .catch((err) => console.error("Failed to fetch country details", err));

      // Fetch cities using the correct new API endpoint
      fetch(`http://127.0.0.1:8000/api/countries/${encodeURIComponent(country as string)}/cities/`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP status ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.cities) {
            setCities(data.cities);
          } else {
            setCities([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch cities:", err);
          setCities([]);
        });
    }
  }, [country]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-h1 font-heading mb-4">Cities in {country}</h1>
      {salary !== null && (
        <h2 className="text-h2 font-medium mb-4">Average Salary: ${salary}</h2>
      )}
      <ul className="space-y-4">
        {cities.length > 0 ? (
          cities.map((city) => (
            <li key={city.id} className="bg-surface p-4 rounded-medium shadow-subtle">
              <Link href={`/city-details/${encodeURIComponent(city.name)}`}>
                <a className="text-primary hover:underline">
                  {city.name} (Population: {city.population})
                </a>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-body text-subdued">No cities found.</p>
        )}
      </ul>
    </div>
  );
}
