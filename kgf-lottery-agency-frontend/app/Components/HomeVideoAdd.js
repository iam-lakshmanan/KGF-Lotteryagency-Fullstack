"use client";
import { useState, useRef } from 'react';
import { Play, Volume2, VolumeX, Pause } from 'lucide-react';

const HomeVideoAdd = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted since user is clicking to play

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent the main container click from pausing the video
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#0050A0] to-[#0080F0] py-16 px-4 flex flex-col items-center">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-2 uppercase tracking-tighter">
          Visit our shop <br /> virtually
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
      </div>

      {/* Video Container */}
      <div className="relative w-full max-w-6xl p-2 border-2 border-dashed border-blue-400 rounded-3xl">
        <div 
          onClick={handlePlayToggle}
          className="relative h-auto w-full overflow-hidden rounded-2xl aspect-video bg-slate-900 shadow-2xl group cursor-pointer"
        >
          
          <video
            ref={videoRef}
            src="/videos/web.mp4"
            loop
            muted={isMuted}
            playsInline
            className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-100' : 'scale-105 blur-[2px] brightness-50'}`}
          >
            Your browser does not support the video tag.
          </video>

          {/* Central Play Button Overlay (Hidden when playing) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative flex items-center justify-center">
                {/* Pulsing Outer Circle */}
                <div className="absolute w-24 h-24 bg-white/20 rounded-full animate-ping opacity-75"></div>
                
                {/* Main White Button Circle */}
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <Play className="text-blue-600 ml-1" size={32} fill="currentColor" />
                </div>
              </div>
            </div>
          )}

          {/* Hover Controls (Only visible when playing) */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <Pause className="text-white" size={32} fill="white" />
               </div>
            </div>
          )}

          {/* Mute Toggle (Visible only when playing) */}
          {isPlaying && (
            <button 
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-40 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-orange-500 transition-all shadow-xl"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}

          {/* Decorative Inner Frame */}
          <div className="absolute inset-4 border border-white/10 border-dashed rounded-xl pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default HomeVideoAdd;