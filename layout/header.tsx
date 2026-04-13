'use client';
import React from 'react';
import Link from 'next/link';
import { FaArchive, FaUserCircle } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react'; // 1. Added this import

const Header: React.FC = () => {
  const { data: session, status } = useSession(); // 2. Grab the session data

  return (
    <header className="flex items-center justify-between shrink-0 w-full h-16 px-6 bg-slate-900 border-b border-slate-800">
      
      {/* Top Left: Logo & Branding (UNTOUCHED) */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <FaArchive className="text-2xl text-emerald-500" />
        <span className="text-xl font-bold text-white tracking-wider">BinShare</span>
      </Link>

      {/* Top Right: Dynamic Auth State */}
      <div className="flex items-center gap-4">
        {status === "loading" ? (
          /* Show a tiny blank placeholder while checking auth so the buttons don't jump */
          <div className="w-24 h-8 bg-slate-800 animate-pulse rounded-md"></div>
        ) : session ? (
          /* LOGGED IN VIEW */
          <>
            <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
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
          /* LOGGED OUT VIEW (Your exact original code) */
          <>
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-500 transition-colors">
              <FaUserCircle className="text-lg" />
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>

    </header>
  );
};

export default Header;