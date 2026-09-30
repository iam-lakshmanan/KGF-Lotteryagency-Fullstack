"use client";
import React, { useState, useEffect } from 'react';
import { Video, Trash2, Edit3, Save, Plus, Upload, Film, X, Loader2,
  ImageIcon,
  FileText, 
  Gift, 
  LayoutDashboard, 
  ChevronRight

  
 } from 'lucide-react';
  import Link from 'next/link';
  import { usePathname } from 'next/navigation';

const VideoManagement = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [existingVideos, setExistingVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [tempDesc, setTempDesc] = useState("");

  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/videos`;

  // 1. READ: Fetch all videos on mount
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/read`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const data = await res.json();
      // Assuming backend returns an array or { success: true, data: [] }
      if (Array.isArray(data)) {
        setExistingVideos(data);
      } else if (data.success) {
        setExistingVideos(data.data);
      }
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 2. CREATE: Upload Video and Thumbnail
  const handleUpload = async () => {
    if (!selectedVideo || !selectedThumbnail || !description.trim()) {
      alert("Please select a video, a thumbnail, and enter a description.");
      return;
    }

    const formData = new FormData();
    // Keys match your router.post requirements
    formData.append("video", selectedVideo);
    formData.append("thumbnailimage", selectedThumbnail);
    formData.append("description", description);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      alert("Video uploaded successfully");
      setSelectedVideo(null);
      setSelectedThumbnail(null);
      setDescription("");
      setActiveTab('gallery');
      fetchVideos();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. UPDATE: Change description
  const handleUpdateDescription = async (id) => {
    if (!tempDesc.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/update-description/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ description: tempDesc }),
      });

      const data = await res.json();
      if (data.success) {
        setExistingVideos(existingVideos.map(v => 
          v.id === id ? { ...v, description: tempDesc } : v
        ));
        setEditingId(null);
      }
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      alert("Failed to update description");
    }
  };

  // 4. DELETE: Remove video
  const handleDeleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setExistingVideos(existingVideos.filter(v => v.id !== id));
      }
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("Failed to delete video");
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
    <>

    <div className="min-h-[20vh]  flex flex-col font-sans mt-20">
    {/* <div className="p-6 bg-white min-h-screen font-sans text-slate-900"> */}

         {/* <div className="min-h-[20vh] bg-[#f8fafc] flex flex-col font-sans mt-20"> */}
      
      {/* --- TOP STICKY HEADER --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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

     

      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    {/* </div> */}
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4 mt-5 ">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Film size={20} className="text-blue-600" />
          Video Assets
        </h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setActiveTab('upload')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'upload' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>UPLOAD VIDEO</button>
          <button onClick={() => setActiveTab('gallery')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'gallery' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>GALLERY ({existingVideos.length})</button>
        </div>
      </div>
    <div className="p-6 bg-white min-h-screen font-sans text-slate-900">

      {/* Upload Section */}
      {activeTab === 'upload' && (
        <div className="max-w-lg mx-auto space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50/50 hover:border-blue-300">
              <input type="file" id="thumbUpload" className="hidden" onChange={(e) => setSelectedThumbnail(e.target.files[0])} accept="image/*" />
              <label htmlFor="thumbUpload" className="cursor-pointer flex flex-col items-center">
                <Upload size={20} className="text-blue-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Cover Image</span>
                <span className="text-[11px] font-semibold text-gray-600 truncate w-full mt-1">
                  {selectedThumbnail ? selectedThumbnail.name : "Select JPG"}
                </span>
              </label>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50/50 hover:border-blue-300">
              <input type="file" id="videoUpload" className="hidden" onChange={(e) => setSelectedVideo(e.target.files[0])} accept="video/*" />
              <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center">
                <Video size={20} className="text-blue-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Video File</span>
                <span className="text-[11px] font-semibold text-gray-600 truncate w-full mt-1">
                  {selectedVideo ? selectedVideo.name : "Select MP4"}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">Description</label>
            <input 
              className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500"
              placeholder="Enter video description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md disabled:bg-blue-300"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
            {loading ? "UPLOADING..." : "START CLOUD UPLOAD"}
          </button>
        </div>
      )}

      {/* Gallery Section */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {existingVideos.map((vid) => (
            <div key={vid.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col group">
              <div className="h-32 relative bg-black">
                <video 
                  src={vid.video_url} 
                  poster={vid.thumbnail_url}
                  className="w-full h-full object-cover opacity-80"
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => {e.target.pause(); e.target.currentTime = 0;}}
                  muted
                  loop
                />
                <button 
                  onClick={() => handleDeleteVideo(vid.id)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-gray-300 uppercase">ID: {vid.id}</span>
                    {editingId !== vid.id && (
                      <button onClick={() => { setEditingId(vid.id); setTempDesc(vid.description); }} className="text-gray-400 hover:text-blue-600">
                        <Edit3 size={12} />
                      </button>
                    )}
                  </div>

                  {editingId === vid.id ? (
                    <div className="space-y-1.5">
                      <input className="w-full border border-blue-200 rounded p-1 text-xs outline-none" value={tempDesc} onChange={(e) => setTempDesc(e.target.value)} autoFocus />
                      <div className="flex gap-1">
                        <button onClick={() => handleUpdateDescription(vid.id)} className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">X</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 leading-tight line-clamp-2 italic font-medium">"{vid.description}"</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
     </div> 
    </div>
    </>
  );
};

export default VideoManagement;