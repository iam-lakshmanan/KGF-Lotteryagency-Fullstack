"use client";
import React from 'react';


export default function AdminLayout({ children }) {
 

  return (
      

<>
      {/* --- CONTENT AREA --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 transition-all duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden p-1 min-h-[70vh]">
            <div className="w-full h-full p-6 md:p-8">
                {children}
            </div>
        </div>
      </main>

      </>

  );
}