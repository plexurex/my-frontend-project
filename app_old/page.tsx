// app/page.tsx
"use client"
import React from 'react';
import Link from 'next/link';

const MainMenu = () => {
    return (
        <div>
            <h1>Hi, welcome to the Migration Helper!</h1>
            <Link href="/country-selection">
                <button>Click here to find your country</button>
            </Link>
        </div>
    );
};

export default MainMenu;
