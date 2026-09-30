

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const VideoCard = () => {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/read`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch videos");
        }

        /**
         * Logic Fix: 
         * Your backend returns { success: true, count: X, data: [rows] }
         * So we set the state to result.data
         */
        setVideos(result.data || []);
      } catch (error) {
        console.error("FETCH ERROR:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePlay = (id) => {
    router.push(`/video/${id}`);
  };

  if (loading) {
    return (
      <div className="col-span-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00aaff]"></div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="text-gray-500 text-xl font-semibold">No videos found.</p>
      </div>
    );
  }

  return (
    <>
      {videos.map((video) => (
        <div key={video.id} className="max-w-sm group">
          <div className="bg-white rounded-[2.5rem] p-5 shadow-xl border border-gray-200 transition-all hover:-translate-y-3">
            
            {/* Thumbnail - Using thumbnail_url from your DB */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <img 
                src={video.thumbnail_url} 
                alt={video.description || "Video Thumbnail"}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/assets/placeholder.jpg"; }}
              />
            </div>

            {/* Title/Description */}
            <div className="mt-6 mb-4 text-center h-12">
              <h3 className="text-orange-600 font-bold uppercase line-clamp-2 text-sm">
                {video.description || "KGF Lottery Highlight"}
              </h3>
            </div>
            
            {/* Play Button */}
            <button 
              onClick={() => handlePlay(video.id)} 
              className="w-full bg-[#00aaff] hover:bg-[#0088cc] text-white font-bold py-3 rounded-full shadow-lg transition-all active:scale-95 uppercase text-xs tracking-widest"
            >
              Play
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default VideoCard;