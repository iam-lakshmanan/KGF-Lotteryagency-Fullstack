"use client";
import { Users, ShieldCheck, Bell } from 'lucide-react';
import Link from 'next/link';

const HomeAboutSection = () => {
  const stats = [
    { 
      label: "100,000+ Happy Customers", 
      icon: <Users className="text-orange-500" size={32} /> 
    },
    { 
      label: "Government Authorized Dealer", 
      icon: <ShieldCheck className="text-orange-500" size={32} /> 
    },
    { 
      label: "Daily Lottery & Result Updates", 
      icon: <Bell className="text-orange-500" size={32} /> 
    },
  ];

  return (
    <section className="relative min-h-[600px] flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
      
      {/* BACKGROUND IMAGE WITH DARK OVERLAY */}
      <div 
        className="absolute inset-0 z-0 bg-cover   bg-center bg-fixed"
        style={{ 
          backgroundImage: `url('/assets/HomeAboutImg.jpg')`, 
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* CENTERED CONTENT */}
      <div className="relative z-10 max-w-4xl text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-white text-3xl md:text-5xl font-bold">
            About
          </h2>
          <h3 className="text-white text-2xl md:text-4xl font-bold">
            kgf lottery <span className="text-orange-500 underline decoration-2 underline-offset-8">agency</span>
          </h3>
        </div>

        <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-light">
          KGF Lottery Agency is a government authorized Kerala lottery dealer known for 
          genuine tickets and transparent service. With years of experience and a strong 
          local presence in Kerala, we are committed to building customer trust through 
          ethical practices, accurate information, and reliable support.
        </p>

        <div className="pt-4">
          <Link 
            href="/OurCompany" 
            className="bg-blue-600 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg inline-block"
          >
            Learn More About Us
          </Link>
        </div>
      </div>

      {/* BOTTOM STATS BAR - GLASSMORPHISM STYLE */}
      <div className="relative z-10 mt-16 w-full max-w-6xl">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-white/5 rounded-full">
                  {stat.icon}
                </div>
                <span className="text-white font-semibold text-lg md:text-xl tracking-wide px-4">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default HomeAboutSection;