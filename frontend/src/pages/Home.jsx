import React from 'react';
import CategoryRail from '../components/home/CategoryRail';
import Hero from '../components/home/Hero';
import TrustBar from '../components/home/TrustBar';
import HowItWorks from '../components/home/HowItWorks';
import OurStory from '../components/home/OurStory';
import FarmToDoor from '../components/home/FarmToDoor';
import FreshThisWeek from '../components/home/FreshThisWeek';
import MeetAFarmer from '../components/home/MeetAFarmer';
import JournalPreview from '../components/home/JournalPreview';
import Testimonials from '../components/home/Testimonials';
import ImpactNumbers from '../components/home/ImpactNumbers';
import CommunityBand from '../components/home/CommunityBand';

/**
 * Hero → Trust → Categories → How it works → Our Story → Farm to door →
 * Fresh this week → Meet a farmer → Journal (+ best sellers) → Testimonials →
 * Impact → Community band (sell + newsletter as one section)
 */
const Home = () => (
  <div className="min-h-screen bg-gray-50 font-sans">
    <Hero />
    <TrustBar />
    <CategoryRail />
    <HowItWorks />
    <OurStory />
    <FarmToDoor />
    <FreshThisWeek />
    <MeetAFarmer />
    <JournalPreview />
    <Testimonials />
    <ImpactNumbers />
    <CommunityBand />
  </div>
);

export default Home;
