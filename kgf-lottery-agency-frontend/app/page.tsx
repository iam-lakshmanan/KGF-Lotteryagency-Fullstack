import Image from "next/image";
import HeroCarousel from './Components/Carousel';
import BumperOffer from './Components/BumperOffer';
import Features from './Components/Features';
import HomeVideoAdd from './Components/HomeVideoAdd';
import HomeCard from './Components/HomeCard';
import HomeAboutSection from './Components/HomeAboutSection';
import ContactMap from './Components/ContactMap';

export const metadata = {
  title: 'KGF Lottery Agency | Kerala Lottery Results, Tickets & Winners Updates',
  description: 'Official KGF Lottery Agency, Gopalapuram. Get latest Kerala lottery results, winning numbers, ticket availability and daily updates. Trusted lottery center serving customers with genuine tickets and fast result updates. Contact us today.',
};

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <BumperOffer />
      <Features />
      <HomeVideoAdd />
      <HomeCard />
      <HomeAboutSection />
      <ContactMap />
    </>
  );
}