
"use client";
import React, { useState, useEffect } from "react";

interface CityPhotoAlbumProps {
  cityName: string;
}

const CityPhotoAlbum: React.FC<CityPhotoAlbumProps> = ({ cityName }) => {
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

export default CityPhotoAlbum;
