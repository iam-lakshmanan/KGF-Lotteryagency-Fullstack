"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Plus,
  Gift // Icon for Bumper Offer
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from "react";


const AdminDashboard = () => {
  // Added Bumper Offer to Stats
  const stats = [
    { label: 'Images', count: '0', icon: <ImageIcon size={20} />, color: 'text-blue-600' },
    { label: 'Videos', count: '0', icon: <Video size={20} />, color: 'text-purple-600' },
    { label: 'Results', count: '0', icon: <FileText size={20} />, color: 'text-orange-600' },
    { label: 'Bumper Active', count: '0', icon: <Gift size={20} />, color: 'text-rose-600' },
  ];

  // Added Bumper Offer to Quick Actions
  const actions = [
    { title: 'Upload Image', href: '/Admin/ImageUpload', icon: <ImageIcon size={20} /> },
    { title: 'Upload Video', href: '/Admin/VideoUpload', icon: <Video size={20} /> },
    { title: 'Post Result', href: '/Admin/ResultUpload', icon: <FileText size={20} /> },
    { title: 'Bumper Offer', href: '/Admin/BumperUpload', icon: <Gift size={20} /> },
  ];

    useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/Admin/Login"); // 🚫 kick out
    }
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen font-sans ">
      {/* 1. Simple Header
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 border-b border-gray-100 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard size={24} className="text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your website content and lottery results.</p>
        </div>

        {/* 2. Clean Stats Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
              <div className={`mb-4 ${stat.color}`}>{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{stat.count}</div>
              <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div> */} 

        {/* 3. Clean Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, i) => (
              <Link 
                key={i} 
                href={action.href} 
                className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:bg-slate-50 hover:border-blue-600 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    {action.icon}
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{action.title}</span>
                </div>
                <Plus size={18} className="text-gray-300 group-hover:text-blue-600 transform group-hover:rotate-90 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    
  );
};

export default AdminDashboard;