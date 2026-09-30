"use client";
import Link from 'next/link';
import { Youtube, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our company', href: '/OurCompany' },
    { name: 'video gallery', href: '/Results' },
    { name: 'Images', href: '/VideoGallery' },
    { name: 'Results', href: '/Images' },
    { name: 'Contact us', href: '/ContactUs' },
  ];



  return (
    <footer className="bg-gradient-to-r from-[#0050A0] to-[#0080F0] text-white pt-12 pb-6 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/20">
          
          {/* Column 1: Agency Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              KGF LOTTERY AGENCY
            </h2>
            <p className="text-sm leading-relaxed text-blue-50/90 font-medium max-w-xs">
              KGF Lottery Agency is a government authorized Kerala lottery dealer committed to providing genuine lottery tickets and transparent services. We focus on customer trust, ethical practices, and accurate lottery information.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6 lg:pl-8">
            <h3 className="text-lg font-bold uppercase tracking-wider">QUICK LINKS</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm hover:text-amber-400 transition-colors duration-200 capitalize"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Address */}
          <div className="space-y-6 lg:pl-4">
            <h3 className="text-lg font-bold uppercase tracking-wider">ADDRESS</h3>
            <p className="text-sm leading-relaxed text-blue-50/90 font-medium">
              No. 7-673, Pollachi to Palakkad Road, <br />
              Gopalapuram, <br />
              Palakkad-678555, <br />
              Kerala, India.
            </p>
          
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-wider">CONTACT US</h3>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-blue-50">Phone number</p>
              <p className="text-2xl font-bold"></p>+91 9074606020
            </div>
            
            <div className="space-y-4">
              <p className="text-lg font-semibold text-blue-50">Join Us</p>
              <div className="flex space-x-5">
                <a href="#" className="hover:text-amber-400 transition-colors"><Youtube size={22} fill="currentColor" /></a>
                <a href="#" className="hover:text-amber-400 transition-colors"><Facebook size={20} fill="currentColor" /></a>
                <a href="#" className="hover:text-amber-400 transition-colors"><Twitter size={20} fill="currentColor" /></a>
                <a href="#" className="hover:text-amber-400 transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-amber-400 transition-colors"><Linkedin size={20} fill="currentColor" /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Credits */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-blue-100 font-medium space-y-4 md:space-y-0">
          <p>
            Copyright © 2026 <span className="text-green-400">kgf lottery agency</span>. All Rights Reserved.
          </p>
          <p>
            Design and developed by <span className="text-green-400 font-bold"><Link href='https://wexoraa.com/'>Wexoraa infotech</Link></span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;