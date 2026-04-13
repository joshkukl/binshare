"use client";
import React, { use, useEffect, useState } from "react";
import { FaDownload, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";

const Download: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = use(params);
  const fileId = resolvedParams.id;

  const [fileData, setFileData] = useState<any>(null);
  // We start with NO warning state at all. 
  const [warningElement, setWarningElement] = useState<React.ReactNode>(null);

  useEffect(() => {
    fetch(`/api/download?token=${fileId}&metadataOnly=true`)
      .then(res => res.json())
      .then(data => {
        if (data.file) {
          setFileData(data.file);
          
          // ONLY if the database explicitly says it's a burn file, 
          // do we generate the warning UI and put it in state.
          if (data.file.metadata?.burnAfterReading === true) {
            setWarningElement(
              <div className="text-orange-400 font-medium flex items-center justify-center gap-2 mt-2">
                <FaExclamationTriangle /> This file will self-destruct after downloading.
              </div>
            );
          }
        }
      })
      .catch(err => console.error("Error checking file:", err));
  }, [fileId]);

  return (
    <div className="flex flex-col flex-1 w-full bg-black text-slate-200">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto h-full p-8">
        
        <div className="w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <FaShieldAlt className="text-5xl text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Secure File Transfer</h1>
          
          <div className="text-slate-400 mb-8 min-h-[64px] flex flex-col items-center justify-center">
            <p>You have been sent a secure, encrypted file.</p>
            
            {/* This variable is NULL when the page loads. 
               The browser renders absolutely nothing here.
               It only changes if the 'setWarningElement' above is called.
            */}
            {warningElement}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-8 flex justify-between items-center text-left">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ready to download</p>
              <p className="text-lg text-slate-200 font-bold font-mono truncate">
                encrypted_payload_{fileId.substring(0,6)}.bin
              </p>
            </div>
            <span className="text-sm font-bold text-slate-400">
              {fileData?.length ? (fileData.length / 1024 / 1024).toFixed(1) : "..."} MB
            </span>
          </div>

          <button 
            onClick={() => window.location.href = `/api/download?token=${fileId}`}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 text-lg"
          >
            <FaDownload /> Download & Decrypt File
          </button>
        </div>

      </main>
    </div>
  );
};

export default Download;