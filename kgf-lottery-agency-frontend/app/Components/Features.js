import { CheckCircle, ShieldCheck, Check, Bell, Users, MapPin } from 'lucide-react';

const Features = () => {
  const features = [
    { title: "Government Authorized Dealer", icon: <CheckCircle className="text-blue-500" size={32} /> },
    { title: "Genuine Kerala Lottery Tickets", icon: <ShieldCheck className="text-blue-500" size={32} /> },
    { title: "Transparent & Ethical Service", icon: <Check className="text-blue-500" size={32} /> },
    { title: "Daily Result Updates", icon: <Bell className="text-blue-500" size={32} /> },
    { title: "Trusted by Regular Customers", icon: <Users className="text-blue-500" size={32} /> },
    { title: "Physical Office in Kerala", icon: <MapPin className="text-blue-500" size={32} /> },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Heading Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Why to choose <br className="md:hidden" />
            KGF lottery <span className="text-blue-600">agency</span>
          </h2>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 p-5 border-2 border-orange-500 rounded-2xl bg-blue-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-lg font-semibold text-gray-800">
                {item.title}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;