"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Save, Trash2, Upload, Ticket, Layers, Calendar, Trophy, 
  PhoneCall, ArrowRight, Image as ImageIcon, CheckCircle2, Sparkles, Loader2 ,Video,    
  FileText, 
  Gift, Plus,
  LayoutDashboard, 
  ChevronRight

} from 'lucide-react';

  import Link from 'next/link';
  import { usePathname } from 'next/navigation';
const BumperUpload = () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const fileInputRef = useRef(null);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    seasonTitle: "",
    marqueeText: "",
    firstPrize: "",
    seriesPrice: "",
    drawDate: "", // Stored as YYYY-MM-DD
    singlePrice: ""
  });

  const getAuthHeader = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("admin_token") : null;
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  const fetchCurrentBumper = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bumper/read`);
      const json = await res.json();
      if (json.success && json.data) {
        setFormData({
          seasonTitle: json.data.season_title,
          marqueeText: json.data.marquee_text,
          firstPrize: json.data.first_prize,
          seriesPrice: json.data.series_price,
          drawDate: json.data.draw_date, 
          singlePrice: json.data.single_price
        });
        setPreviewImage(json.data.poster_image_url);
        setCurrentId(json.data.id);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchCurrentBumper();
  }, [fetchCurrentBumper]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const file = fileInputRef.current?.files[0];

      if (!currentId && !file && !previewImage) return alert("Please select an image");

      const data = new FormData();
      data.append("seasonTitle", formData.seasonTitle);
      data.append("marqueeText", formData.marqueeText);
      data.append("singlePrice", formData.singlePrice);
      data.append("seriesPrice", formData.seriesPrice);
      data.append("drawDate", formData.drawDate); // Sending clean ISO string
      data.append("firstPrize", formData.firstPrize);
      if (file) data.append("image", file);

      const res = await fetch(`${API_BASE}/api/bumper/create`, {
        method: "POST",
        headers: getAuthHeader(),
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchCurrentBumper();
      } else {
        alert(result.message || "Failed to publish");
      }
    } catch (err) {
      console.error(err);
      alert("Publishing failed");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!currentId) return alert("No active bumper to delete");
    if (!confirm("Delete this bumper?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/bumper/delete/${currentId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (res.ok) {
        setFormData({ seasonTitle: "", marqueeText: "", firstPrize: "", seriesPrice: "", drawDate: "", singlePrice: "" });
        setPreviewImage(null);
        setCurrentId(null);
        alert("Bumper deleted");
      }
    } catch (err) {
      console.error(err);
    }
  };
   const pathname = usePathname();
  
    // Navigation config matching your screenshots
   const navItems = [
    { name: 'Upload Image', href: '/Admin/ImageUpload', icon: <ImageIcon size={18} /> },
    { name: 'Upload Video', href: '/Admin/VideoUpload', icon: <Video size={18} /> },
    { name: 'Post Result', href: '/Admin/ResultUpload', icon: <FileText size={18} /> },
    { name: 'Bumper Offer', href: '/Admin/BumperUpload', icon: <Gift size={18} /> },
  ];
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 relative">
      
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 size={20} />
          <span className="font-bold text-xs sm:text-sm">HOMEPAGE SUCCESSFULLY UPDATED!</span>
        </div>
      )}

      {/* Header Bar */}
          <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 transition-transform group-hover:rotate-6">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="font-black text-slate-900 tracking-tight leading-none text-lg">K.G.F ADMIN</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
           
           
          </div>
        </div>

        {/* --- CENTERED QUICK ACTION NAVIGATION --- */}
        <nav className="w-full border-t border-slate-100 py-3 bg-white/50">
          <div className="max-w-5xl mx-auto px-6 flex justify-center items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-5 py-2.5 rounded-[1.25rem] transition-all duration-500 border whitespace-nowrap
                    ${isActive 
                      ? 'bg-white border-blue-200 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)] text-blue-600' 
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100'}
                  `}
                >
                  <div className={`
                    p-1.5 rounded-lg transition-all duration-500 
                    ${isActive ? 'bg-blue-50 text-blue-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:scale-110 group-hover:bg-slate-200'}
                  `}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wider transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>
                    {item.name}
                  </span>
                  {isActive ? (
                    <ChevronRight size={14} className="animate-bounce-x text-blue-400" />
                  ) : (
                    <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm z-50">
        <h1 className="text-sm sm:text-lg font-black tracking-tight flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> BUMPER EDITOR
        </h1>
        
        <div className="flex items-center gap-2">
          {currentId && (
            <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 size={18} />
            </button>
          )}
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={`${isPublishing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 sm:px-6 py-2 rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center gap-2 shadow-lg`}
          >
            {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            {isPublishing ? 'SAVING...' : 'PUBLISH NOW'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 bg-white overflow-y-auto border-r order-2 lg:order-1">
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Season Title</label>
                <input name="seasonTitle" value={formData.seasonTitle} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Marquee Message</label>
                <textarea name="marqueeText" value={formData.marqueeText} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs h-24 resize-none font-medium leading-relaxed" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Poster Image</label>
                <div onClick={() => fileInputRef.current.click()} className="group border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center bg-slate-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all">
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  {previewImage ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mb-2 border">
                        <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                      <p className="text-[10px] font-bold text-blue-600 uppercase">Change Image</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-slate-300 group-hover:text-blue-400 mb-2" size={24} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Click to Upload Poster</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">First Prize</label>
                  <input name="firstPrize" value={formData.firstPrize} onChange={handleChange} placeholder="₹10,00,00,000" className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Series Price</label>
                  <input name="seriesPrice" value={formData.seriesPrice} onChange={handleChange} placeholder="₹4,500" className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block text-blue-600">Draw Date (Picker)</label>
                  {/* Changed to type="date" to fix Invalid Date issue */}
                  <input type="date" name="drawDate" value={formData.drawDate} onChange={handleChange} className="w-full p-3 bg-blue-50 border-blue-200 border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Single Price</label>
                  <input name="singlePrice" value={formData.singlePrice} onChange={handleChange} placeholder="₹500" className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="h-20 lg:hidden" />
          </div>
        </div>

        {/* PREVIEW SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-10 bg-slate-100 flex items-start lg:items-center justify-center order-1 lg:order-2">
          <div className="w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl border-4 border-white relative overflow-hidden">
            
            <div className="bg-blue-600 rounded-xl py-2 px-4 mb-6 overflow-hidden">
              <p className="text-[9px] text-white font-bold whitespace-nowrap animate-pulse uppercase tracking-tight italic">
                {formData.marqueeText || "MARQUEE PREVIEW"}
              </p>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 italic flex items-center justify-center gap-2 flex-wrap">
                <Sparkles size={20} className="text-blue-600" />
                {formData.seasonTitle || "SUMMER BUMPER"}
                <span className="text-blue-600 not-italic text-sm px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100 uppercase">Special</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/2 aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100 flex items-center justify-center shadow-inner group">
                {previewImage ? (
                  <img src={previewImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                ) : (
                  <ImageIcon className="text-slate-200" size={48} />
                )}
              </div>

              <div className="w-full sm:w-1/2 flex flex-col justify-between space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { val: formData.firstPrize, lab: "First Prize", icon: Trophy, color: "text-orange-500", bg: "bg-orange-50" },
                    { val: formData.seriesPrice, lab: "Series Price", icon: Layers, color: "text-purple-500", bg: "bg-purple-50" },
                    { val: formData.drawDate, lab: "Draw Date", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { val: formData.singlePrice, lab: "Single Price", icon: Ticket, color: "text-blue-500", bg: "bg-blue-50" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm">
                      <div className={`${item.bg} p-2 rounded-lg`}>
                        <item.icon className={item.color} size={16}/>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">{item.lab}</p>
                        <p className="text-[11px] font-bold text-slate-700 truncate">{item.val || "Select Date"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-blue-600 py-3.5 rounded-2xl flex items-center justify-center gap-3 text-white shadow-lg shadow-blue-200">
                    <PhoneCall size={14} /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">Book Your Ticket</span> 
                    <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BumperUpload;