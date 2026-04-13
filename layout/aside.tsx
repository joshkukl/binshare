'use client';
import React from 'react';
import Link from 'next/link';
import { FaHome, FaUpload, FaLock, FaInfoCircle } from 'react-icons/fa';

const Aside: React.FC = () => {
  return (
    <aside className="shrink-0 flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4">
      
      <nav className="flex flex-col gap-2 mt-4">
        {/* 1. Home / Landing Page */}
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <FaHome className="text-lg" />
          <span className="font-medium">Home</span>
        </Link>
        
        {/* 2. Upload Tool (Utility) */}
        <Link href="/upload" className="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <FaUpload className="text-lg" />
          <span className="font-medium">Upload</span>
        </Link>

        {/* 4. Dashboard (Private Vault) */}
        <Link href="/vault" className="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <FaLock className="text-lg" />
          <span className="font-medium">Vault</span>
        </Link>
      </nav>

      {/* 6. About (Info) */}
      <div className="mt-auto">
        <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <FaInfoCircle className="text-lg" />
          <span className="font-medium">About BinShare</span>
        </Link>
      </div>

    </aside>
  );
};

export default Aside;