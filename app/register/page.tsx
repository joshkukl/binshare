"use client";
import React, { useState } from "react"; // 1. Added useState
import Link from "next/link";
import { useRouter } from "next/navigation"; // 2. Added Next.js router to redirect after success
import { FaArchive } from "react-icons/fa";

const Register: React.FC = () => {
  // 3. Set up state to hold the form data and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // 4. The actual function that talks to your new API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any old errors

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send exactly what the schema expects
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success! Redirect the user to the login page
      router.push("/login");
      
    } catch (err: any) {
      setError(err.message);
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
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
            <p className="text-slate-400 text-sm mt-1">Start sharing files securely today</p>
          </div>

          {/* 5. Hook up the form to our new function */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Added a red error message box that only shows if something goes wrong */}
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
                value={email} // Bind to state
                onChange={(e) => setEmail(e.target.value)} // Update state on type
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password} // Bind to state
                onChange={(e) => setPassword(e.target.value)} // Update state on type
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Create a strong password"
              />
            </div>

            {/* Change button text when loading */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account? <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">Sign in</Link>
          </p>
        </div>

      </main>
    </div>
  );
};

export default Register;