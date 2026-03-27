'use client';
import React from 'react';

type SectionProps = {
  children?: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ children }) => {
  return (
    <section className="flex items-center justify-center w-full h-full p-16 my-4 bg-yellow-600 rounded-md border border-yellow-700">
      {children}
    </section>
  );
};

export default Section;