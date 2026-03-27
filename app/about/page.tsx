"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@mui/material";

const About: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="flex w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex w-full max-w-3xl flex-col items-center py-12 px-8 bg-white dark:bg-black rounded-lg shadow-md sm:items-start">
        <h1 className="text-4xl font-bold mb-6">About DropVault</h1>
        
        <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
          <Image
            src="/vaultimage_0.jpg"
            alt="About Image"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300">
          DropVault is a secure, automated file-sharing platform designed to handle 
          temporary data lifecycles with built-in garbage collection.
        </p>

        <div className="flex space-x-4">
          <div className="flex">The Count is {count}</div>
          <div>
            <Button variant="contained" onClick={() => setCount(count + 1)}>
              Increment
            </Button>
          </div>
          <div>
            <Button variant="contained" onClick={() => setCount(count - 1)}>
              Decrement
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default About;