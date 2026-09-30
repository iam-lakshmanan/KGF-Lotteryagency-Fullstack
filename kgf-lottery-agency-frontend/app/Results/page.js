import ContactMap from '../Components/ContactMap'
import Carousel from '../Components/Carousel'
import ResultCard from '../Components/ResultCard'

export const metadata = {
  title: 'Kgf lottery agency| most trusted lottery agency since 2020',
  description: 'Most Trusted Lottery Agency Since 2020. Government Authorized Kerala State Lottery Ticket Selling Partner with 1,00,000+ Happy Customers. Buy Daily and Bumper Tickets Online with Instant Ticket Booking. Check Live Results Daily.',
};

export default function Result(){

return(


    <>
              {/* Banner Section */}
      <div className="relative w-full h-[400px] md:h-[400px] overflow-hidden flex items-center justify-center font-sans">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/assets/heroimg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-2">
            <span className="text-[#00aaff] drop-shadow-lg">Results</span>{" "}
            <span className="text-white drop-shadow-lg">page</span>
          </h1>
          <div className="w-32 h-2 bg-orange-500 mx-auto rounded-full shadow-lg mb-6" />
          <p className="text-gray-200 text-sm md:text-xl font-bold uppercase tracking-[0.3em] drop-shadow-md">
            Your Gateway to Winning Moments
          </p>
        </div>
      </div>
    <ResultCard/>
    <ContactMap/>
    
    </>
)



}