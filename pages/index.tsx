"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MainMenu() {
  const [mounted, setMounted] = useState(false);
  const [cityImages, setCityImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState(true);
  
  // Popular destinations with details
  const popularDestinations = [
    {
      name: "New York",
      country: "United States",
      description: "The city that never sleeps"
    },
    {
      name: "London",
      country: "United Kingdom",
      description: "Historic charm meets modern culture"
    },
    {
      name: "Tokyo",
      country: "Japan",
      description: "Tradition blends with innovation"
    },
    {
      name: "Sydney",
      country: "Australia",
      description: "Stunning harbors and vibrant lifestyle"
    }
  ];

  // Fetch images for each city
  useEffect(() => {
    setMounted(true);
    
    const fetchCityImages = async () => {
      const images: Record<string, string> = {};
      
      try {
        // Fetch images in parallel
        await Promise.all(
          popularDestinations.map(async (city) => {
            try {
              const res = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                  city.name + " city"
                )}&per_page=1&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
              );
              
              if (res.ok) {
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                  images[city.name] = data.results[0].urls.regular;
                }
              }
            } catch (err) {
              console.error(`Failed to fetch image for ${city.name}:`, err);
            }
          })
        );
        
        setCityImages(images);
      } catch (err) {
        console.error("Failed to fetch city images:", err);
      } finally {
        setLoadingImages(false);
      }
    };
    
    fetchCityImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className={`lg:w-1/2 mb-10 lg:mb-0 ${mounted ? 'animate-fade-in' : ''}`}>
            <h1 className="text-h1 font-heading mb-6 text-primary">
              Find Your Perfect <span className="text-accent">Migration Destination</span>
            </h1>
            <p className="text-lg mb-8 text-text/80 max-w-xl">
              Explore cities worldwide, compare living costs, job opportunities, 
              and quality of life metrics to make an informed decision on where to move next.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/preferences">
                <button className="px-6 py-3 bg-accent text-white rounded-xl shadow-lg hover:bg-accent/90 transform transition hover:-translate-y-1 flex items-center">
                  <span className="mr-2">Find Your City</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </Link>
              <Link href="/recommendation-form">
                <button className="px-6 py-3 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transform transition hover:-translate-y-1">
                  Share Your Experience
                </button>
              </Link>
            </div>
          </div>
          <div className={`lg:w-1/2 ${mounted ? 'animate-slide-up' : ''}`}>
            <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-skyblue/20 to-secondary/20"></div>
              <div className="w-full h-full bg-gradient-to-br from-skyblue to-secondary rounded-xl flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="text-6xl mb-4">🌍</div>
                  <p className="text-xl font-bold">Discover Your Next Home</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-surface py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-h2 font-heading text-center mb-12 text-primary">
            How It <span className="text-accent">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Set Your Preferences",
                description: "Tell us what matters to you - budget, amenities, job opportunities, and more."
              },
              {
                icon: "📊",
                title: "Get Recommendations",
                description: "Our ML algorithm finds the best matching cities based on your unique preferences."
              },
              {
                icon: "✅",
                title: "Make Your Decision",
                description: "Compare detailed city information and user recommendations to choose confidently."
              }
            ].map((feature, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl shadow-medium hover-card ${mounted ? 'animate-slide-up' : ''}`} style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-primary">{feature.title}</h3>
                <p className="text-subdued">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cities Showcase */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-h2 font-heading text-center mb-12">
            <span className="text-primary">Popular</span> <span className="text-accent">Destinations</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((city, index) => (
              <Link 
                key={index} 
                href={`/city-details/${encodeURIComponent(city.name)}`}
                className={`block rounded-xl shadow-medium overflow-hidden relative group transform transition hover:-translate-y-2 hover:shadow-lg ${mounted ? 'animate-fade-in' : ''}`} 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="aspect-square">
                  {loadingImages ? (
                    // Loading placeholder
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-skyblue/30 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : cityImages[city.name] ? (
                    // City image
                    <img 
                      src={cityImages[city.name]} 
                      alt={`${city.name}, ${city.country}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    // Fallback gradient if image failed to load
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-skyblue/30 flex items-center justify-center">
                      <span className="text-4xl">{city.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {/* Information overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 transition-all duration-300 group-hover:from-black/90">
                  <p className="text-white font-bold text-lg">{city.name}</p>
                  <p className="text-white/80 text-sm mb-1">{city.country}</p>
                  <p className="text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity">{city.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-primary to-skyblue text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-h2 font-heading mb-6">Ready to Find Your Perfect City?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Start your migration journey today and discover cities that match your lifestyle, budget, and preferences.
          </p>
          <Link href="/preferences">
            <button className="px-8 py-4 bg-accent text-white rounded-xl shadow-lg hover:bg-accent/90 transform transition hover:-translate-y-1 text-lg font-bold">
              Begin Your Search
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}