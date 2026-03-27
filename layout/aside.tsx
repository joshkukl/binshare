'use client';
import React from 'react';
import { FaUser } from 'react-icons/fa';

const Aside: React.FC = () => {
    return (
        // Using flex to center the content vertically and horizontally, and setting a width for the aside
        <aside className="flex flex-col items-center justify-center w-72 shrink-0 bg-teal-500 p-8">
            
            {/* Icon Container */}
            <div className="flex items-center justify-center bg-sky-300 w-full aspect-square max-w-[200px]">
                <FaUser className="text-white text-7xl" />
            </div>

            {/* text under icon */}
            <h2 className="mt-4 text-xl font-bold text-white">User's name</h2>
            
        </aside>
    );
}

export default Aside;