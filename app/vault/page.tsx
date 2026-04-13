"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFolderOpen, FaTrashAlt, FaExternalLinkAlt, FaFileAlt, FaLock } from "react-icons/fa";
import { Button } from "@mui/material";
import { LuVault } from "react-icons/lu";
import { useSession } from "next-auth/react"; // ADDED NEXTAUTH HOOK

const Vault: React.FC = () => {
  const { data: session, status } = useSession(); // GRAB SESSION STATUS
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stop immediately if they aren't logged in
    if (status !== "authenticated") {
        setLoading(false);
        return;
    }

    const fetchVault = async () => {
      try {
        const res = await fetch('/api/vault');
        const data = await res.json();
        if (data.success) {
          setFiles(data.files);
        }
      } catch (err) {
        console.error("Failed to load vault:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVault();
  }, [status]); // Re-run if login status changes

  const handleDelete = async (fileId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this file?")) return;

    try {
      const res = await fetch(`/api/vault?id=${fileId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setFiles(files.filter(file => file._id !== fileId));
      } else {
        alert("Failed to delete the file.");
      }
    } catch (err) {
      console.error("Delete request failed:", err);
    }
  };

  // --- UI STATE 1: LOGGED OUT (ACCESS DENIED) ---
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col flex-1 w-full bg-black">
        <main className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto h-full p-8 pt-24 text-slate-200">
          <FaLock className="text-6xl text-emerald-500 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-8">You must be logged in to view your Personal Vault.</p>
          <Link href="/login">
            <Button variant="contained" className="bg-emerald-600 hover:bg-emerald-500 font-bold normal-case">
              Log In to Continue
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  // --- UI STATE 2: LOADING ---
  if (loading || status === "loading") {
    return (
      <div className="flex flex-col flex-1 w-full bg-black items-center justify-center text-slate-400">
        <p className="animate-pulse">Accessing Vault Chunks...</p>
      </div>
    );
  }

  // --- UI STATE 3: LOGGED IN (SHOW VAULT) ---
  return (
    <div className="flex flex-col flex-1 w-full bg-black">
      <main className="flex flex-col items-start justify-start w-full max-w-5xl mx-auto h-full p-8 pt-12 text-slate-200">
        
        <div className="w-full flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <LuVault className="text-4xl text-emerald-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">My Vault</h1>
              <p className="text-slate-400 text-sm">Manage your active links and encrypted files.</p>
            </div>
          </div>
          <Link href="/upload">
            <Button variant="contained" className="bg-emerald-600 hover:bg-emerald-500 font-bold normal-case">
              + New Upload
            </Button>
          </Link>
        </div>

        {files.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl text-center">
            <FaFolderOpen className="text-6xl text-slate-800 mb-4" />
            <h2 className="text-xl font-bold text-slate-300 mb-2">Your vault is empty</h2>
            <p className="text-slate-500 max-w-md mb-6 text-sm">
              You haven't uploaded any permanent files yet.
            </p>
            <Link href="/upload">
              <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors">
                Go to Drop Zone
              </button>
            </Link>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file._id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <FaFileAlt className="text-emerald-500/50 text-xl" />
                    <h3 className="font-mono text-sm font-bold truncate text-slate-200 w-full" title={file.filename}>
                      {file.filename}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Size: {(file.length / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Stored: {new Date(file.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/download/${file.metadata.token}`}
                    target="_blank"
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition"
                  >
                    <FaExternalLinkAlt size={10} /> View Link
                  </Link>
                  <button 
                    onClick={() => handleDelete(file._id)}
                    className="px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded transition border border-red-900/30"
                  >
                    <FaTrashAlt size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Vault;