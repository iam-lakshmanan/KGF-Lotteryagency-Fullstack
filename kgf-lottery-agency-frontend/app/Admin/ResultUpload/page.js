"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, Upload, Trash2, Edit3, Save, Eye, 
  Calendar as CalendarIcon, X, 
  FileCheck, ChevronRight, CheckCircle2, Loader2,Video,   Plus, 
  ImageIcon,
  Gift, 
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';   

const ResultManagement = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;;

  const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);
// Pagination Calculations
const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;
const currentRows = results.slice(indexOfFirstRow, indexOfLastRow);
const totalPages = Math.ceil(results.length / rowsPerPage);

// Reset to page 1 if rowsPerPage changes
const handleRowsPerPageChange = (e) => {
  setRowsPerPage(parseInt(e.target.value));
  setCurrentPage(1);
};
  
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("admin_token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  // THE HARD FIX: Extract only YYYY-MM-DD from any string format
  const hardFixDate = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10);
  };

  const [formData, setFormData] = useState({
    publisher: "",
    date: "",
    image: null,
    pdf: null
  });

  const [editValues, setEditValues] = useState({ publisherName: "", publishDate: "" });

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/results/read`);
      const json = await res.json();
      
      if (json.success) {
        // SORTING: Use a combined sort (Date + ID) to ensure the newest is ALWAYS at top
        const sorted = json.data.sort((a, b) => {
          // First sort by date string (Descending)
          const dateCompare = b.publish_date.localeCompare(a.publish_date);
          // If dates are identical, sort by ID (Newest ID first)
          return dateCompare !== 0 ? dateCompare : b.id - a.id;
        });

        const cleanedData = sorted.map(item => ({
          ...item,
          publish_date: hardFixDate(item.publish_date) 
        }));

        setResults(cleanedData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handlePushToWebsite = async () => {
    if (!formData.publisher || !formData.date || !formData.image || !formData.pdf) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("publisherName", formData.publisher);
    // Send the date exactly as picked (YYYY-MM-DD)
    data.append("publishDate", formData.date); 
    data.append("image", formData.image);
    data.append("pdf", formData.pdf);

    try {
      const res = await fetch(`${API_BASE}/api/results/create`, {
        method: "POST",
        headers: getAuthHeader(),
        body: data,
      });
      
      const result = await res.json();
      if (res.ok && result.success) {
        setFormData({ publisher: "", date: "", image: null, pdf: null });
        await fetchResults(); // Refresh list
        setActiveTab('manage'); // Switch to history
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/results/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({
          publisherName: editValues.publisherName,
          publishDate: editValues.publishDate 
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchResults();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/results/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchResults();
      }
    } catch (err) {
      console.error("Delete error:", err);
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
    <div className="min-h-[20vh]  flex flex-col font-sans mt-20">

      
      {/* Tab Header */}
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
{/* 
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab('upload')} className={`px-8 py-2.5 text-xs font-black rounded-xl transition-all ${activeTab === 'upload' ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}>CREATE</button>
          <button onClick={() => setActiveTab('manage')} className={`px-8 py-2.5 text-xs font-black rounded-xl transition-all ${activeTab === 'manage' ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}>HISTORY</button>
        </div>
      </div> */}
     <div className=" min-h-screen font-sans text-slate-900">

<div className="max-w-7xl mx-auto mb-6 flex justify-end mt-10">

  <div className="flex gap-3">
    <button
      onClick={() => setActiveTab('upload')}
      className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${
        activeTab === 'upload'
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500"
      }`}
    >
      UPLOAD
    </button>

    <button
      onClick={() => setActiveTab('manage')}
      className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${
        activeTab === 'manage'
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500"
      }`}
    >
      MANAGE
    </button>
  </div>

</div>
      {activeTab === 'upload' && (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileCheck size={20} className="text-blue-600"/> Result Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase ml-1">Publisher Name</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase ml-1">Draw Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="pt-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase ml-1">PDF File</label>
                    <div className="relative group">
                      <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setFormData({...formData, pdf: e.target.files[0]})} />
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex items-center justify-between group-hover:bg-blue-50 transition-all">
                        <span className="text-sm font-bold text-slate-500 truncate">{formData.pdf ? formData.pdf.name : "Choose PDF"}</span>
                        {formData.pdf ? <CheckCircle2 size={18} className="text-green-500" /> : <ChevronRight size={18} className="text-slate-300" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col flex-grow">
                <div className="relative border-2 border-dashed border-slate-100 rounded-[1.5rem] flex-grow flex flex-col items-center justify-center bg-slate-50/50 p-2 min-h-[300px]">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={(e) => e.target.files[0] && setFormData({...formData, image: e.target.files[0]})} />
                  {formData.image ? (
                    <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-contain rounded-xl" alt="Preview" />
                  ) : (
                    <div className="text-center"><Upload className="mx-auto text-blue-600 mb-2" /><p className="text-xs font-black text-slate-400 uppercase">Select Image</p></div>
                  )}
                </div>
                <button onClick={handlePushToWebsite} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-sm mt-4 shadow-xl hover:bg-blue-700 flex items-center justify-center gap-3 disabled:opacity-50" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "PUBLISH NOW"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
  <div className="max-w-7xl mx-auto space-y-4">
    {/* Table Controls */}
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show</label>
        <select 
          value={rowsPerPage} 
          onChange={handleRowsPerPageChange}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-blue-500"
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>{size} Rows</option>
          ))}
        </select>
      </div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, results.length)} of {results.length}
      </div>
    </div>

    {/* Table */}
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">S.No</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Visual</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Publisher</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Draw Date</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentRows.map((res, index) => (
              <tr key={res.id} className="group hover:bg-blue-50/30 transition-all">
                <td className="px-8 py-6 text-xs font-black text-slate-300">
                  #{indexOfFirstRow + index + 1}
                </td>
                {/* ... Rest of your existing <td> cells (Visual, Publisher, Draw Date, Actions) ... */}
                <td className="px-6 py-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-white shadow-sm">
                    <img src={res.image_url} className="w-full h-full object-cover" alt="Result" />
                    <a href={res.pdf_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye size={16} className="text-white" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingId === res.id ? (
                    <input className="bg-white border-2 border-blue-100 rounded-xl px-4 py-2 text-xs font-bold w-full" value={editValues.publisherName} onChange={(e) => setEditValues({...editValues, publisherName: e.target.value})} />
                  ) : (
                    <span className="text-sm font-black text-slate-800">{res.publisher_name}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === res.id ? (
                    <input type="date" className="bg-white border-2 border-blue-100 rounded-xl px-4 py-2 text-xs font-bold" value={editValues.publishDate} onChange={(e) => setEditValues({...editValues, publishDate: e.target.value})} />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                      <CalendarIcon size={14} className="text-slate-300"/>
                      {hardFixDate(res.publish_date)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex justify-end gap-3 items-center">
                    {deleteConfirmId === res.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(res.id)} className="bg-red-500 text-white p-2 rounded-lg"><Trash2 size={12}/></button>
                        <button onClick={() => setDeleteConfirmId(null)} className="bg-slate-100 p-2 rounded-lg"><X size={12}/></button>
                      </div>
                    ) : (
                      <>
                        {editingId === res.id ? (
                          <button onClick={() => saveEdit(res.id)} className="p-3 bg-green-500 text-white rounded-xl shadow-lg"><Save size={16}/></button>
                        ) : (
                          <button onClick={() => { setEditingId(res.id); setEditValues({ publisherName: res.publisher_name, publishDate: hardFixDate(res.publish_date) }); }} className="p-3 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit3 size={18} /></button>
                        )}
                        <button onClick={() => setDeleteConfirmId(res.id)} className="p-3 text-slate-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center items-center gap-2">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
        >
          <ChevronRight size={18} className="rotate-180" />
        </button>
        
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-400 hover:bg-blue-50"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    </div>
  );
};

export default ResultManagement;