"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { FaCloudUploadAlt, FaLock, FaFire, FaClock, FaCog, FaCopy, FaCheck } from "react-icons/fa";
import { useSession } from "next-auth/react"; // 1. ADDED THIS IMPORT

const Upload: React.FC = () => {
  const { data: session } = useSession(); // 2. Grab login status
  const [saveToVault, setSaveToVault] = useState(false); // 3. Track the user's choice
  const [burnAfterReading, setBurnAfterReading] = useState(false); // Add this

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); 
  const [copied, setCopied] = useState(false);
  
  const processFile = async (file: File) => {
    setDownloadUrl(null); // ADD THIS: Clears any old link before starting
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("saveToVault", String(saveToVault)); // 4. Tell the backend the choice
    formData.append("burnAfterReading", String(burnAfterReading)); // Add this

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      
      const url = `${window.location.origin}/download/${data.data[0].token}`;
      setDownloadUrl(url);
    } catch (error) {
      console.error(error);
      alert("Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-black">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto h-full p-8 text-slate-200">
        
        <div className="w-full text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Secure Drop Zone</h1>
          <p className="text-slate-400">Files are encrypted locally before transmission.</p>
        </div>

        {/* Drag & Drop Area */}
        <div 
          className={`w-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 ${
            isDragging ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <FaCloudUploadAlt className={`text-6xl mb-4 ${isDragging ? "text-emerald-500" : "text-slate-500"}`} />
          <p className="text-lg font-medium mb-1">Drag and drop your files here</p>
          <p className="text-sm text-slate-500 mb-4">or click to browse from your computer</p>
          
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {isUploading ? "Uploading..." : "Select Files"}
          </button>
        </div>

        {/* 5. REPLACED THIS ENTIRE SECTION */}
        <div className="w-full mt-8 p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
            <FaCog className="text-slate-400" /> Storage Options
          </h3>
          <div className="flex flex-col gap-4">
            
            {/* Option A: Temporary Drop */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="storage"
                checked={!saveToVault}
                onChange={() => setSaveToVault(false)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer" 
              />
              <div className="flex flex-col">
                <span className="font-medium text-slate-200 group-hover:text-white transition-colors flex items-center gap-2">
                  <FaClock className="text-blue-500" /> Temporary Drop
                </span>
                <span className="text-sm text-slate-500">File is securely deleted automatically after 24 hours.</span>
              </div>
            </label>

            {/* Option B: Save to Vault */}
            <label className={`flex items-center gap-3 ${session ? 'cursor-pointer group' : 'opacity-50 cursor-not-allowed'}`}>
              <input 
                type="radio" 
                name="storage"
                disabled={!session}
                checked={saveToVault}
                onChange={() => setSaveToVault(true)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed" 
              />
              <div className="flex flex-col">
                <span className="font-medium text-slate-200 group-hover:text-white transition-colors flex items-center gap-2">
                  <FaLock className="text-emerald-500" /> Save to Personal Vault
                </span>
                <span className="text-sm text-slate-500">
                  {session ? "File lives forever in your account until you delete it." : "Log in to save files permanently."}
                </span>
              </div>
            </label>

            <hr className="border-slate-800 my-2" />

            {/* Option C: Burn Modifier */}
            <label className={`flex items-center gap-3 ${saveToVault ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}>
              <input 
                type="checkbox" 
                disabled={saveToVault}
                checked={burnAfterReading}
                onChange={(e) => setBurnAfterReading(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed" 
              />
              <div className="flex flex-col">
                <span className={`font-medium transition-colors flex items-center gap-2 ${saveToVault ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'}`}>
                  <FaFire className={saveToVault ? "text-slate-600" : "text-orange-500"} /> Burn after reading
                </span>
                <span className="text-sm text-slate-500">File is permanently deleted once the link is opened.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Success Popup Modal (UNCHANGED) */}
        {/* Success Popup Modal */}
        {downloadUrl && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-emerald-500/50 p-8 rounded-xl max-w-lg w-full shadow-2xl text-center">
              <div className="mb-4 flex justify-center">
                {saveToVault ? (
                  <FaLock className="text-5xl text-emerald-500" />
                ) : (
                  <FaCheck className="text-5xl text-emerald-500" />
                )}
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {saveToVault ? "Securely Vaulted!" : "Upload Complete!"}
              </h2>

              {saveToVault ? (
                <div className="mb-6">
                  <p className="text-slate-400 mb-6 text-sm">
                    This file is now stored permanently in your vault. You can manage it or share the link from your Vault dashboard.
                  </p>
                  <Link href="/vault">
                    <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors mb-4">
                      Go to My Vault
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-slate-400 mb-6">Your secure download link is ready.</p>
                  <div className="flex items-center gap-2 bg-black border border-slate-700 p-2 rounded-lg mb-6">
                    <input
                      type="text"
                      readOnly
                      value={downloadUrl}
                      className="bg-transparent text-slate-300 w-full outline-none px-2 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(downloadUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-semibold transition flex items-center gap-2 whitespace-nowrap"
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  setDownloadUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-slate-500 hover:text-slate-300 transition text-sm underline"
              >
                Close and upload another file
              </button>
            </div>
          </div>
        )}    
      </main>
    </div>
  );
};

export default Upload;