"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CityPhotos = () => {
  const searchParams = useSearchParams();
  const cityName = searchParams.get("city") || "";
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
          )}&per_page=12&client_id=KVtNgVHig9uuR54QYw-J5BGCJ_U_0QzPXlyJr8WyRgg`
        );
        if (!res.ok) {
          throw new Error(`Error fetching photos: ${res.status}`);
        }
        const data = await res.json();
        setPhotos(data.results);
      } catch (e: any) {
        setError(e.message || "An error occurred while fetching photos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [cityName]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attractions in {cityName}</h1>
      {loading ? (
        <p>Loading photos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : photos.length === 0 ? (
        <p>No photos found for {cityName}.</p>
      ) : (
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
      )}
    </div>
  );
};

export default CityPhotos;
