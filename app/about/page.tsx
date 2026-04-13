"use client";
import React from "react";
import Image from "next/image";
import { FaShieldAlt, FaUserSecret, FaFire } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 w-full bg-black overflow-y-auto">
      <main className="flex flex-col items-center justify-start w-full max-w-4xl mx-auto p-8 pt-12 text-slate-200">
        
        <h1 className="text-4xl font-bold mb-8">About BinShare</h1>
        
        <div className="relative w-full h-64 mb-10 overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
          <Image
            src="/vaultimage_0.jpg"
            alt="BinShare Vault Concept"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="w-full space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">The Platform</h2>
            <p>
              BinShare is a secure, automated file-sharing platform engineered to handle temporary data lifecycles with built-in garbage collection. Instead of relying on traditional file servers that leave vulnerable artifacts behind, uploads are converted directly into BSON BinData and stored securely within a temporary database cluster.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-800">
            <div className="flex flex-col items-center text-center">
              <FaShieldAlt className="text-3xl text-emerald-500 mb-3" />
              <h3 className="font-medium text-white mb-1">Zero Trust</h3>
              <p className="text-sm text-slate-400">Files are encrypted before they ever leave your device.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaFire className="text-3xl text-orange-500 mb-3" />
              <h3 className="font-medium text-white mb-1">Burn After Reading</h3>
              <p className="text-sm text-slate-400">Database records are permanently wiped the second a link is opened.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaUserSecret className="text-3xl text-blue-500 mb-3" />
              <h3 className="font-medium text-white mb-1">Total Privacy</h3>
              <p className="text-sm text-slate-400">No logs, no tracking, and absolute anonymity for your transfers.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Built for Security</h2>
            <p>
              Designed for developers and security-conscious teams, the architecture focuses heavily on secure network protocols and robust system design. By implementing strict data handling and automatic deletion, the platform ensures your information remains completely locked down from end to end.
            </p>
          </section>
        </div>

      </main>
    </div>
  );
};

export default About;