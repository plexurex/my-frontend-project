// app/cities/[country].tsx
"use client"
import React from 'react';
import { useRouter } from 'next/router';

const CityDisplay = () => {
    const router = useRouter();
    const { country } = router.query;

    return (
        <div>
            <h1>Cities in {country}</h1>
            {/* Additional city display logic will go here */}
        </div>
    );
};

export default CityDisplay;
