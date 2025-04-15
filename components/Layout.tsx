// components/Layout.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Migration Recommender" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Migration Recommender System" />
      </Head>
      <header className="bg-primary text-surface py-4 shadow-medium">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">
            <Link href="/">Migration Recommender</Link>
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/preferences" className="hover:underline">
                  Preferences
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:underline">
                  Recommendations
                </Link>
              </li>
              <li>
                <Link href="/user-recommendations" className="hover:underline">
                  User Recs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/recommendation-form" className="hover:underline font-semibold">
                  Submit Recommendation
                </Link>
              </li>
              <li>
                <Link href="/search-country" className="hover:underline font-semibold">
                  Search Country
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-text text-surface py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Migration Recommender. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
