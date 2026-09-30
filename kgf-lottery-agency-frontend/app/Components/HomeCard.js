import { Film, Monitor, Target } from 'lucide-react';
import Link from 'next/link';

const HomeCard = () => {
  const services = [
    {
      title: "KGF Video Gallery",
      desc: '"KGF Lottery Agency Video Gallery showcase of winning moments and joyful stories!"',
      icon: <Film size={48} strokeWidth={1.5} />,
      link: "/VideoGallery"
    },
    {
      title: "KGF Image Gallery",
      desc: '"KGF Lottery Agency image Gallery – Where dreams come alive, one win at a time!"',
      icon: <Monitor size={48} strokeWidth={1.5} />,
      link: "/Images"
    },
    {
      title: "Results",
      desc: '"Kerala Lottery Results are announced daily at 3 PM, offering life-changing prizes up to ₹25 Crores!"',
      icon: <Target size={48} strokeWidth={1.5} />,
      link: "/Results"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <Link href={service.link} key={index} className="group">
              <div className="h-full flex flex-col items-center text-center p-10 border-2  border-orange-500 rounded-[40px] hover:text-white hover:bg-gradient-to-r from-[#0050A0] to-[#0080F0]   transition-all duration-300 group-hover:shadow-2xl   group-hover:-translate-y-2 ">
                
                {/* Icon Circle - Matching the Blue Outline Style */}
                <div className="mb-8 text-blue-600 border-2 border-blue-600 rounded-full p-6 group-hover:bg-blue-50 transition-colors">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold  mb-6">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed italic px-2">
                  {service.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCard;