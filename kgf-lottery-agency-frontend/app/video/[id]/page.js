"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const videoRef = useRef(null); // Reference to control the video player

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/read`);
        const result = await res.json();
        if (res.ok) {
          setVideos(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const currentVideo = videos.find((v) => String(v.id) === String(id));
  const otherVideos = videos.filter((v) => String(v.id) !== String(id));

  // --- FIX FOR ABORTERROR ---
  // If the ID changes, we want to ensure the video reloads properly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Forces the player to reset to the new source
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="p-10 text-white bg-black h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Video not found (ID: {id})</h1>
        <button onClick={() => router.push('/VideoGallery')} className="bg-orange-500 px-6 py-2 rounded-full font-bold">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black mt-25 text-white p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* REPLACED IFRAME WITH VIDEO TAG */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
          <video
            ref={videoRef}
            key={currentVideo.id} // Important: forces re-render on video change
            controls
            className="w-full h-full"
            poster={currentVideo.thumbnail_url}
            preload="metadata" // Only loads metadata, saves 100MB of bandwidth until play is clicked
            playsInline
          >
            <source src={currentVideo.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h1 className="mt-8 text-xl md:text-2xl font-bold text-center uppercase tracking-tight px-4 text-orange-500">
          {currentVideo.description}
        </h1>

        {/* Other Videos Section */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[2px] w-12 bg-orange-500"></div>
            <h2 className="text-orange-500 text-2xl font-bold uppercase">Other Videos</h2>
            <div className="h-[2px] w-12 bg-orange-500"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherVideos.map((video) => (
              <div 
                key={video.id}
                className="group cursor-pointer"
                onClick={() => {
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                   router.push(`/video/${video.id}`);
                }}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-zinc-800">
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.description} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
                      <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-white ml-1"></div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm font-bold uppercase line-clamp-2 group-hover:text-orange-400 transition-colors">
                  {video.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}