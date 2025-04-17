import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Migration Recommender" }) => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Migration Recommender System" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@700;900&display=swap" rel="stylesheet" />
      </Head>
      
      <header className="bg-gradient-to-r from-primary to-skyblue text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="mr-2">🌍</span>
              <span className="font-heading">Migration Recommender</span>
            </Link>
          </h1>
          <nav className="w-full md:w-auto">
            <ul className="flex flex-wrap justify-center md:space-x-6">
              <li className="mx-2 my-1">
                <Link 
                  href="/preferences" 
                  className={`hover:text-highlight transition-colors px-3 py-2 rounded-lg ${isActive('/preferences') ? 'bg-white/20 font-semibold' : ''}`}
                >
                  Preferences
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link 
                  href="/recommendations" 
                  className={`hover:text-highlight transition-colors px-3 py-2 rounded-lg ${isActive('/recommendations') ? 'bg-white/20 font-semibold' : ''}`}
                >
                  Recommendations
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link 
                  href="/user-recommendations" 
                  className={`hover:text-highlight transition-colors px-3 py-2 rounded-lg ${isActive('/user-recommendations') ? 'bg-white/20 font-semibold' : ''}`}
                >
                  User Reviews
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link 
                  href="/about" 
                  className={`hover:text-highlight transition-colors px-3 py-2 rounded-lg ${isActive('/about') ? 'bg-white/20 font-semibold' : ''}`}
                >
                  About
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link
                  href="/search-country" 
                  className={`hover:text-highlight transition-colors px-3 py-2 rounded-lg ${isActive('/search-country') ? 'bg-white/20 font-semibold' : ''}`}
                >
                  Search Country
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link 
                  href="/recommendation-form" 
                  className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:-translate-y-1 shadow-md"
                >
                  Submit Review
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="min-h-[calc(100vh-180px)]">
        {children}
      </main>
      
      <footer className="bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          {/* Changed to a 2-column grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Migration Recommender</h3>
              <p className="text-gray-300">
                Helping you find your perfect new home around the world.
              </p>
              <p className="text-gray-300 mt-2">
                Our platform combines real user experiences with accurate city data to help you make the best migration decisions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-highlight">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/preferences" className="text-gray-300 hover:text-highlight">
                    Find Cities
                  </Link>
                </li>
                <li>
                  <Link href="/user-recommendations" className="text-gray-300 hover:text-highlight">
                    User Recommendations
                  </Link>
                </li>
                <li>
                  <Link href="/recommendation-form" className="text-gray-300 hover:text-highlight">
                    Submit a Review
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-highlight">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} Migration Recommender. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;