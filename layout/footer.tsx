'use client';
import React, { useEffect, useState } from 'react';


const Footer: React.FC = () => {
    const [time, setTime] = useState<Date | null>(null);
    
    useEffect(() => {
        const tick = () => {
            setTime(new Date());
        };

        const interval = setInterval(tick, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <footer className="w-full py-4 border-b border-gray-200 flex items-center justify-center px-8">
            <p className="text-sm text-gray-500">&copy; 2026 Josh Kuklinski</p>
            {time && <p className="text-sm text-gray-500 ml-4">{time.toLocaleTimeString()}</p>}
        </footer>
    );
}
export default Footer;