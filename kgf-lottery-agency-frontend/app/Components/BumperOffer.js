"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  Ticket, 
  Layers, 
  ArrowRight, 
  PhoneCall,
  Sparkles
} from 'lucide-react';

const BumperOffer = () => {
  const [bumperData, setBumperData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define API Base - Update this if your backend is on a different port/domain
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;; 

  useEffect(() => {
    const fetchBumper = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bumper/read`);
        
        // If the API itself is down or 404
        if (!res.ok) {
          setBumperData(null);
          return;
        }

        const json = await res.json();

        // Check if we actually have a bumper object
        if (json.success && json.data) {
          setBumperData(json.data);
        } else {
          // No active bumper in DB - this is fine, just hide the section
          setBumperData(null);
        }
      } catch (error) {
        // Only log if it's a real connection error, don't throw an alert
        console.warn("Bumper is currently inactive or server is unreachable.");
        setBumperData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBumper();
  }, []);

  // 1. Hide the entire section if loading or no data exists (Seasonal logic)
  if (loading || !bumperData) return null;

  // 2. Data Mapping for the boxes based on your DB keys
  const infoBoxes = [
    { 
      id: 1,  
      label: "First Prize", 
      value: bumperData.first_prize || "TBA", 
      icon: <Trophy className="text-orange-500" size={22}/> 
    },
    { 
      id: 2, 
      label: "Ticket Set Price", 
      value: `${bumperData.series_price}`, 
      // sub: "Pack of 10 Tickets", 
      icon: <Layers className="text-purple-500" size={22}/> 
    },
    { 
      id: 3, 
      label: "Draw Date", 
      value: bumperData.draw_date ? new Date(bumperData.draw_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Coming Soon", 
      icon: <Calendar className="text-emerald-500" size={22}/> 
    },
    { 
      id: 4, 
      label: "Single Ticket Price", 
      value: `${bumperData.single_price}`, 
      icon: <Ticket className="text-blue-500" size={22}/> 
    },
  ];

  return (
    <section className="w-full bg-slate-50 py-10 px-4 md:px-8 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
       {/* 1. Marquee Section - RECTIFIED */}
<div className="bg-blue-600 rounded-xl py-3 mb-6 shadow-lg shadow-blue-100 relative overflow-hidden flex">
  <div className="flex whitespace-nowrap animate-marquee-fast">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <span key={i} className="text-white font-bold text-xs md:text-sm uppercase tracking-widest px-8">
        {bumperData.marquee_text}
      </span>
    ))}
  </div>
</div>

        {/* 2. BUMPER TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic flex flex-wrap items-center justify-center gap-3">
            <Sparkles className="text-blue-600 animate-pulse" size={32} />
            {bumperData.season_title}
            <span className="text-blue-600 not-italic">SPECIAL</span>
          </h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-10">
          
         {/* 3. Left Side: Bumper Image */}
<div className="w-full lg:w-7/12">
  <div className="relative h-full bg-white rounded-3xl p-2 shadow-2xl border border-slate-200 overflow-hidden group">
    <img 
      src={bumperData.poster_image_url} 
     
      
      className="w-full h-auto md:h-full md:min-h-[300px] rounded-2xl object-contain transition-transform duration-700 group-hover:scale-105"
      alt="Bumper Ticket Poster"
      onError={(e) => {e.target.src = "https://via.placeholder.com/1200x600?text=Offer+Coming+Soon"}}
    />
    <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
      Exclusive Draw
    </div>
  </div>
</div>

          {/* 4. Right Side: Boxes & Contact */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoBoxes.map((box) => (
                <div 
                  key={box.id} 
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-4 relative overflow-hidden"
                >
                  <div className="absolute -right-2 -bottom-2 opacity-5 text-slate-900 group-hover:scale-125 transition-transform">
                    {box.icon}
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors relative z-10">
                    {box.icon}
                  </div>
                  <div className="relative z-10">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{box.label}</p>
                    <p className="text-lg font-bold text-slate-800 tracking-tight">{box.value}</p>
                    {box.sub && <p className="text-[10px] font-medium text-blue-500/70">{box.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-auto">
              <a 
                href="tel:+919074606020"
                className="w-full bg-blue-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all duration-300 flex items-center justify-center gap-4 group tracking-widest text-sm uppercase no-underline"
              >
                <PhoneCall size={20} className="group-hover:animate-bounce" />
                Contact For Booking
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-[0.2em]">
                Verified Kerala State Lottery Partner
              </p>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.33%); } /* Adjusted for 3 items */
  }
  .animate-marquee-fast {
    display: flex;
    flex-shrink: 0;
    min-width: 100%;
    /* Reduced time from 35s to 15s for faster movement */
    animation: marquee 15s linear infinite;
  }
  .animate-marquee-fast:hover {
    animation-play-state: paused;
  }
`}</style>
    </section>

    
  );
};

export default BumperOffer;