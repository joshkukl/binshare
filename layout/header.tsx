'use client';
import React from 'react';
import Link from 'next/link'; 
import { FaArchive } from 'react-icons/fa'; 
import { MdHistory, MdSettings, MdHelpOutline } from 'react-icons/md';

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between w-full h-24 px-8 p-4 bg-fuchsia-700">            
            
            {/* 1. Header Icon Container - THIS IS THE ONLY HOME LINK */}
            <Link href="/" className="flex items-center justify-center w-20 h-16 bg-fuchsia-400 cursor-pointer hover:bg-fuchsia-300">
                <FaArchive className="text-3xl text-white" />
            </Link>

            {/* 2. Nav Container with 3 Items */}
            <nav className="flex items-center justify-between h-18 px-8 p-4 gap-4 items-center bg-fuchsia-400">
                
                {/* About Link */}
                <Link href="/about">
                    <div className="flex items-center gap-2 px-6 py-3 text-white bg-purple-900 cursor-pointer hover:bg-purple-800">
                        <MdHelpOutline /> <span>About</span>
                    </div>
                </Link>

                {/* History - Restored, NOT a link to home */}
                <div className="flex items-center gap-2 px-6 py-3 text-white bg-purple-900 cursor-pointer hover:bg-purple-800">
                    <MdHistory /> <span>History</span>
                </div>

                {/* Settings */}
                <div className="flex items-center gap-2 px-6 py-3 text-white bg-purple-900 cursor-pointer hover:bg-purple-800">
                    <MdSettings /> <span>Settings</span>
                </div>
            </nav>
            
        </header>
    );
};

export default Header;