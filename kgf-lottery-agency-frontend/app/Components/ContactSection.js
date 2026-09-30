"use client";
import React from 'react';
import { Phone, MapPin, Send } from 'lucide-react';
import Image from 'next/image';
import ContactMap from './ContactMap';

const ContactSection = () => {
  return (
    <>
   
    <section className="py-12 bg-gray-50 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Flex Container */}
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Left Side */}
          <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
            <Image 
              src="/assets/HomeAboutImg.jpg"
              alt="KGF Lottery Agency"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <h2 className="text-2xl font-black uppercase mb-3">Visit Our Agency</h2>
              <div className="space-y-2 text-sm font-bold">
                <p className="flex items-center gap-3"><Phone size={18} className="text-orange-500" /> 90746 06020</p>
                <p className="flex items-center gap-3"><MapPin size={18} className="text-orange-500" /> Gopalapuram, Kerala, India</p>
              </div>
            </div>
          </div>

          {/* Right Side*/}
          <div className="lg:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
              Get in <span className="text-blue-600">Touch</span>
            </h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">
              KGF LOTTERY AGENCY
            </p>

            {/* Reduced space-y from 6 to 4 */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Input */}
                <div className="relative">
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                {/* Phone Input */}
                <div className="relative">
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Phone <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    placeholder="Phone number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-700 mb-1 block">Email</label>
                <input 
                  type="email" 
                  placeholder="yourname@email.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Message Input */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-700 mb-1 block">Message</label>
                <textarea 
                  rows="2"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit Button*/}
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group"
              >
                Send Message
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>

    <ContactMap/>

    </>
  );
};

export default ContactSection;