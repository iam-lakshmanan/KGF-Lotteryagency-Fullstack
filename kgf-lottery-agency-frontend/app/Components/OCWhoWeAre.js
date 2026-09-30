import Image from 'next/image';

const WhoWeAre = () => {
  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto font-sans">
      {/* Centered Heading with Orange Underline */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          Who we <span className="text-blue-600">are</span>
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Branded Image Container */}
        <div className="relative rounded-[30px] overflow-hidden shadow-xl border border-gray-100 h-[400px] lg:h-[500px]">
          <Image 
            src="/assets/HomeAboutImg.jpg" 
            alt="KGF Lottery Agency Counter"
            fill
            className="object-cover"
          />
        </div>

        {/* Right: Content Section */}
        <div className="space-y-6">
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
            KGF LOTTERY <span className="text-orange-500">AGENCY</span>
          </h3>
          
          <div className="space-y-4 text-gray-500 leading-relaxed font-medium">
            <p>
              KGF Lottery Agency is a government authorized Kerala lottery dealer 
              committed to providing genuine lottery tickets and transparent services. 
              Based in Palakkad, Kerala, we operate with a strong focus on trust, ethical 
              practices, and customer satisfaction.
            </p>
            
            <p>
              With years of experience in the Kerala lottery sector, we have served over 
              100,000+ customers by offering reliable information, accurate updates, and 
              responsible guidance. Our goal is to maintain long-term relationships built on 
              honesty and professionalism.
            </p>
            
            <p>
              We strictly follow the rules and regulations set by the Kerala State Lottery 
              Department and sell lottery tickets only through authorized offline counters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;