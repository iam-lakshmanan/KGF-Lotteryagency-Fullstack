"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { Facebook, Instagram, Send, Menu, X, ShieldCheck } from 'lucide-react'; // ShieldCheck is perfect for Admin
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'OUR COMPANY', href: '/OurCompany' },
    { name: 'RESULTS', href: '/Results' },
    { name: 'VIDEO GALLERY', href: '/VideoGallery' },
    { name: 'IMAGES', href: '/Images' },
    { name: 'CONTACT US', href: '/ContactUs' },
  ];

  return (
    <header className="fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out flex justify-center pt-4 px-4 sm:px-0">
      <nav className={`
        transition-all duration-500 ease-in-out flex items-center justify-between bg-white text-black shadow-lg
        ${isScrolled 
          ? "w-full mt-[-1rem] rounded-none py-3 px-8 border-b border-gray-100" 
          : "max-w-6xl w-full rounded-xl py-4 px-10 border border-gray-200"   
        }
      `}>
        
        {/* Logo Area */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo 1.png"
              alt="Company Logo"
              width={140}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`relative text-sm font-bold transition-colors duration-300 py-1
                  ${isActive ? "text-blue-600" : "text-black hover:text-blue-600"}
                `}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-[-4px] left-0 w-full h-[3px] bg-orange-500 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Socials, Admin & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          {/* Social Icons & Admin (Visible on desktop) */}
          <div className="hidden md:flex items-center space-x-4 border-r border-gray-100 pr-4">
            <a href="#" className="text-blue-600 hover:scale-110 transition-transform">
              <Facebook size={20} fill="currentColor" />
            </a>
            <a href="#" className="text-pink-500 hover:scale-110 transition-transform">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:scale-110 transition-transform">
              <Send size={20} fill="currentColor" />
            </a>
          </div>

          

          {/* Mobile Toggle Button */}
          <button 
            className="lg:hidden text-blue-600 p-1" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl lg:hidden flex flex-col p-6 space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-lg font-bold flex items-center justify-between border-b border-gray-50 pb-2
                    ${isActive ? "text-blue-600" : "text-gray-800"}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                  {isActive && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                </Link>
              );
            })}
            
            {/* Mobile Admin & Socials Footer */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-6">
                <a href="#" className="text-blue-600"><Facebook size={24} fill="currentColor" /></a>
                <a href="#" className="text-pink-500"><Instagram size={24} /></a>
                <a href="#" className="text-blue-400"><Send size={24} fill="currentColor" /></a>
              </div>
              
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;