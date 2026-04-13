import React from "react";
import Link from "next/link";
import { FaShieldAlt, FaFire, FaTerminal } from 'react-icons/fa';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 w-full bg-black">
      <main className="flex flex-col items-center justify-center w-full h-full p-8 text-slate-200">
      
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-3xl mb-16 mt-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Share sensitive data. <br />
            <span className="text-emerald-500">Leave zero trace.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
            The secure, burn-after-reading file transfer utility built for developers. 
            Share API keys, environment variables, and sensitive documents that self-destruct the moment they are viewed.
          </p>

          {/* Primary Call to Action (Routes to the Upload Tool) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/upload" className="px-8 py-4 text-lg font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50">
              Go to Upload Tool
            </Link>
            <Link href="/about" className="px-8 py-4 text-lg font-bold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
              How it Works
            </Link>
          </div>
        </section>

        {/* Feature Highlights (3-Column Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-8 border-t border-slate-800 pt-16">
        
          <div className="flex flex-col items-center text-center p-6 bg-slate-900 rounded-xl border border-slate-800">
            <FaShieldAlt className="text-4xl text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">End-to-End Secure</h3>
            <p className="text-slate-400 text-sm">Files are converted to BinData and encrypted in transit to ensure total privacy.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-slate-900 rounded-xl border border-slate-800">
            <FaFire className="text-4xl text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Burn After Reading</h3>
            <p className="text-slate-400 text-sm">Links are strictly one-time-use. The database record is permanently wiped the second it is opened.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-slate-900 rounded-xl border border-slate-800">
            <FaTerminal className="text-4xl text-sky-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Developer First</h3>
            <p className="text-slate-400 text-sm">Optimized for sharing config files, passwords, and tokens without leaving a digital footprint.</p>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Home;