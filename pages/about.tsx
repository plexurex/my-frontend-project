import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// About Page
const AboutPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`container mx-auto px-6 py-8 ${mounted ? 'animate-fade-in' : ''}`}>
      <div className="gradient-header mb-10">
        <h1 className="text-h1 font-heading text-center">About Migration Helper</h1>
        <p className="text-center mt-2 opacity-90">The story behind the application</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Personal Introduction Section */}
        <div className="bg-surface p-8 rounded-xl shadow-medium mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-primary/20 flex-shrink-0 bg-gray-200 flex items-center justify-center">
            <Image 
                src="/yousef-profile.jpg" 
                alt="Yousef Wisam" 
                width={192} 
                height={192}
                className="w-full h-full object-cover" 
                />
            </div>

            <div className="flex-1">
              <h2 className="text-h3 font-heading text-primary mb-4">Yousef Wisam</h2>
              <p className="text-lg text-subdued mb-4">
                <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-sm">Student Developer</span>
                <span className="mx-2">•</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">21 Years Old</span>
                <span className="mx-2">•</span>
                <span className="bg-skyblue/10 text-skyblue px-2 py-1 rounded-full text-sm">Migration Enthusiast</span>
              </p>
              <p className="mb-4">
                I'm currently studying at the University of Nottingham Malaysia, pursuing my passion for technology and problem-solving.
                As a dedicated student, I've always been interested in creating solutions that make a real difference in people's lives.
              </p>
              <p>
                When I'm not coding, you can find me at the gym working on my fitness, enjoying video games, or researching about different countries and cultures.
                I believe in the power of technology to connect people and improve lives across borders.
              </p>
            </div>
          </div>
        </div>

        {/* The Migration Helper Story */}
        <div className="bg-surface p-8 rounded-xl shadow-medium mb-10">
          <h2 className="text-h3 font-heading text-primary border-b pb-4 mb-6">The Migration Helper Story</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-h4 font-heading text-accent mb-3">Personal Experience</h3>
                <p className="text-subdued">
                  My journey with Migration Helper began with my own experience moving to Saudi Arabia. Despite extensive research, 
                  I found it incredibly challenging to gather reliable information about suitable locations, cost of living, safety ratings,
                  and community aspects of different cities.
                </p>
                <p className="mt-4 text-subdued">
                  I spent countless hours browsing forums, reading outdated blog posts, and trying to connect 
                  with locals to get real insights. This fragmented process made what should have been an exciting time 
                  much more stressful than it needed to be.
                </p>
              </div>
              <div className="w-full md:w-80 h-60 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-primary/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-80 h-60 bg-gradient-to-br from-skyblue/20 to-secondary/20 rounded-lg flex items-center justify-center text-skyblue/40 order-1 md:order-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="flex-1 order-0 md:order-1">
                <h3 className="text-h4 font-heading text-skyblue mb-3">Solution Through Technology</h3>
                <p className="text-subdued">
                  That's when the idea for Migration Helper was born. I envisioned a platform that would centralize 
                  all the critical information migrants need: from cost of living and job opportunities to safety ratings 
                  and cultural insights. The goal was simple—make migration decisions easier, more informed, and less stressful.
                </p>
                <p className="mt-4 text-subdued">
                  By combining data analytics, machine learning, and real user experiences, Migration Helper offers a comprehensive 
                  solution for anyone considering a move to a new city or country.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Purpose Section */}
        <div className="bg-surface p-8 rounded-xl shadow-medium mb-10">
          <h2 className="text-h3 font-heading text-primary border-b pb-4 mb-6">Purpose & Mission</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background p-6 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-h5 font-heading text-primary mb-3">Reliable Information</h3>
              <p className="text-subdued">
                Migration Helper is committed to providing accurate, up-to-date information about cities worldwide. 
                We believe that reliable data is the foundation of good decision-making, especially for life-changing 
                decisions like migration.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-h5 font-heading text-accent mb-3">Community Insights</h3>
              <p className="text-subdued">
                Beyond just data, we believe in the power of community. Migration Helper enables users to share their 
                real-life experiences, creating a support network for prospective migrants and providing authentic insights 
                that numbers alone can't capture.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl">
              <div className="w-16 h-16 bg-skyblue/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-skyblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-h5 font-heading text-skyblue mb-3">Personalized Recommendations</h3>
              <p className="text-subdued">
                We understand that everyone's needs are different. Our intelligent recommendation system takes into 
                account your preferences, priorities, and circumstances to suggest cities that truly match your unique situation.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-h5 font-heading text-secondary mb-3">Breaking Barriers</h3>
              <p className="text-subdued">
                Migration Helper aims to break down the informational barriers that make migration challenging. 
                By democratizing access to crucial information, we're empowering more people to pursue opportunities 
                globally and build the lives they envision.
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-xl shadow-medium text-white text-center">
          <h2 className="text-h3 font-heading mb-4">Join the Journey</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Migration Helper is more than just a tool—it's a community of global citizens sharing insights and supporting each other. 
            Whether you're planning a move or have experiences to share, we'd love to have you as part of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/preferences">
              <button className="px-6 py-3 bg-white text-primary rounded-xl shadow-lg hover:bg-gray-100 transform transition hover:-translate-y-1">
                Start Your Search
              </button>
            </Link>
            <Link href="/recommendation-form">
              <button className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-lg transform transition hover:-translate-y-1">
                Share Your Experience
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;