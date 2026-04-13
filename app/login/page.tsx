"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // The NextAuth magic function
import { FaArchive } from "react-icons/fa";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // NextAuth's signIn handles the API call automatically
      const res = await signIn("credentials", {
        redirect: false, // We handle the redirect manually
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        // Success! Send them to the Vault
        router.push("/vault");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-black">
      <main className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-full p-8 text-slate-200">
        
        <div className="w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <FaArchive className="text-4xl text-emerald-500 mb-4" />
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your BinShare account</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account? <Link href="/register" className="text-emerald-500 hover:text-emerald-400 font-medium">Create one</Link>
          </p>
        </div>

      </main>
    </div>
  );
};

export default Login;