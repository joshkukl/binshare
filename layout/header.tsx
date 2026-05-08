'use client';
import React from 'react';
import Link from 'next/link';
import { FaArchive, FaUserCircle, FaBars } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react'; 

// 1. Add the prop interface so it accepts the toggle function
interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { data: session, status } = useSession(); 

  return (
    <header className="flex items-center justify-between shrink-0 w-full h-16 px-6 bg-slate-900 border-b border-slate-800">
      
      {/* Top Left: Logo & Branding */}
      <div className="flex items-center gap-3">
        {/* 2. Add the Hamburger button (Hidden on Desktop, Visible on Mobile) */}
        <button 
          onClick={onMenuClick} 
          className="md:hidden text-slate-300 hover:text-white transition-colors"
        >
          <FaBars className="text-2xl" />
        </button>

        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <FaArchive className="text-2xl text-emerald-500" />
          <span className="text-xl font-bold text-white tracking-wider">BinShare</span>
        </Link>
      </div>

      {/* Top Right: Dynamic Auth State */}
      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="w-24 h-8 bg-slate-800 animate-pulse rounded-md"></div>
        ) : session ? (
          <>
            <span className="text-sm font-medium text-slate-300 flex items-center gap-2 hidden sm:flex">
              <FaUserCircle className="text-lg text-emerald-500" />
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-500 transition-colors">
              <FaUserCircle className="text-lg" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </>
        )}
      </div>

    </header>
  );
};

export default Header;