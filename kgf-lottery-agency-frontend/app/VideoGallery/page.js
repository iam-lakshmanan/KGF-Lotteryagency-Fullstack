

"use client";
import React from 'react';
import VideoCard from "../Components/VideoCard";

const VideoGallery = () => {
  return (
    <>
      {/* Banner Section */}
      <div className="relative w-full h-[400px] md:h-[400px] overflow-hidden flex items-center justify-center font-sans">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/assets/heroimg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-2">
            <span className="text-[#00aaff] drop-shadow-lg">Video</span>{" "}
            <span className="text-white drop-shadow-lg">Gallery</span>
          </h1>
          <div className="w-32 h-2 bg-orange-500 mx-auto rounded-full shadow-lg mb-6" />
          <p className="text-gray-200 text-sm md:text-xl font-bold uppercase tracking-[0.3em] drop-shadow-md">
            Explore Our Winning Moments
          </p>
        </div>
      </div>

      <div className="bg-white min-h-screen mt-3">
        {/* Dark Title Header */}
        <div className="bg-gradient-to-r from-[#0050A0] to-[#0080F0] py-6 mb-10 shadow-md">
          <h2 
  style={{ fontSize: "clamp(1.1rem, 5vw, 2.5rem)" }}
  className="text-white text-center font-extrabold uppercase tracking-tight sm:tracking-widest px-4"
>
  KGF LOTTERY HIGHLIGHTS!
</h2>
        </div>

        {/* Video Grid Container */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* We call VideoCard once. 
               It will fetch the data and render all cards internally.
            */}
            <VideoCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoGallery;