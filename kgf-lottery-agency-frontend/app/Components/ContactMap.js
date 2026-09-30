"use client";
import { Phone, MessageCircle } from 'lucide-react';

const ContactMap = () => {
  // Exact address from the agency branding
  const address = "7-673, Pollachi to Palakkad Road, Gopalapuram, Palakkad-678555.";
  

const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.528890724642!2d76.8671627731681!3d10.693628460719287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba83f9af289d9db%3A0x3b8a4f62dd0b1ca9!2sKGF%20LOTTERY%20AGENCY!5e0!3m2!1sen!2sin!4v1770826631576!5m2!1sen!2sin";
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto font-sans">
      {/* Section Heading with Orange Accent */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Find us on google <br className="md:hidden" /> maps
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        
        {/* Exact Pinned Map Container */}
        <div className="lg:col-span-2 h-[450px] w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <iframe 
            src={mapEmbedUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="KGF Lottery Agency Location"
          ></iframe>
          
        </div>

        {/* Agency Contact Details */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 p-4">
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              KGF Lottery Agency
            </h3>
            <p className="text-gray-600 font-medium leading-relaxed max-w-sm">
              {address}
            </p>
          </div>

          <div className="w-full space-y-4 max-w-md lg:max-w-xs">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Contact</h4>
            
            {/* Primary Blue Call Button */}
            <a 
              href="tel:+919074606020" 
              className="flex items-center justify-center gap-3 w-full bg-[#008cff] hover:bg-[#0070cc] text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Phone size={20} fill="currentColor" />
              Call us now
            </a>

            {/* Branded WhatsApp Green Button */}
            <a 
              href="https://wa.me/919074606020" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#006e21] hover:bg-[#005a1b] text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95"
            >
              <MessageCircle size={22} fill="currentColor" />
              Whatsapp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactMap;