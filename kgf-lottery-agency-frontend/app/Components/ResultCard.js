"use client";
import React, { useState, useEffect } from 'react';
import { Eye, Download, Search, Loader2 } from 'lucide-react';

const ResultCard = () => {
  const [allResults, setAllResults] = useState([]);
  const [sidebarResults, setSidebarResults] = useState([]);
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");

 const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/results/read`;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        if (json.success) {
          // Sort descending (latest first)
          const sorted = json.data.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
          setAllResults(sorted);
          
          // Sidebar shows top 5 latest
          setSidebarResults(sorted.slice(0, 5));
          
          // Set initial view to the most recent result
          if (sorted.length > 0) setActiveResult(sorted[0]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleCalendarSearch = (e) => {
    const selected = e.target.value; 
    setSearchDate(selected);
    
    if (!selected) return;

    const [year, month, day] = selected.split('-').map(Number);
    const searchDateObj = new Date(year, month - 1, day).toDateString();

    const found = allResults.find(r => {
      const dbDateObj = new Date(r.publish_date).toDateString();
      return dbDateObj === searchDateObj;
    });

    if (found) {
      setActiveResult(found);
    } else {
      setActiveResult(null); 
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#0070e0] text-white font-bold">
      <Loader2 className="animate-spin mr-3" size={32} />
      Loading Results...
    </div>
  );

  return (
    <div className="bg-[#0070e0] min-h-screen pt-8 pb-10 px-4 md:px-10 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md">
            {activeResult 
              ? `${activeResult.publisher_name} - ${formatDateDisplay(activeResult.publish_date)}` 
              : "No Results Found"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-gray-900 text-xl font-bold mb-1">Search results by date</h2>
            <p className="text-gray-400 text-xs mb-6">Choose any date to search history</p>
            
            <div className="relative mb-8">
              <input 
                type="date" 
                value={searchDate}
                onChange={handleCalendarSearch}
                className="w-full border-2 border-[#0070e0] rounded-2xl p-3 font-bold text-gray-700 outline-none focus:ring-2 ring-blue-100"
              />
            </div>
            
            <h3 className="font-bold text-gray-800 mb-4 tracking-wider uppercase text-sm">Last 5 days results</h3>
            <div className="space-y-3">
              {sidebarResults.map((result) => (
                <button 
                  key={result.id} 
                  onClick={() => setActiveResult(result)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-md ${
                    activeResult?.id === result.id 
                    ? "bg-[#ff6600] text-white" 
                    : "bg-[#0070e0] text-white hover:bg-blue-700"
                  }`}
                >
                  {formatDateDisplay(result.publish_date)}
                </button>
              ))}
            </div>
          </div>

            {/* VIEW PAGE: Image display & Action buttons */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-[3rem] p-4 shadow-2xl h-[400px] md:h-[450px] w-full border-[10px] border-white relative overflow-hidden flex items-center justify-center">
              {activeResult ? (
                <img 
                  src={activeResult.image_url} 
                  alt="Result" 
                  className="w-full h-full object-fill rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300">
                  <Search size={80} className="mb-4 opacity-10" />
                  <p className="text-xl font-bold opacity-40">No records found for this date</p>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS: */}
            {activeResult && (
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  onClick={() => window.open(activeResult.image_url, '_self')}
                  className="flex-1 bg-[#00aaff] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Preview image <Eye size={20} />
                </button>
                
                <a 
                  href={activeResult.pdf_url} 
                  className="flex-1 bg-[#ff6600] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-center"
                >
                  View PDF <Download size={20} />
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultCard;