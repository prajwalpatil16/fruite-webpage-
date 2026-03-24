import React from 'react';
import { Clock, Truck } from 'lucide-react';
import CategoryRail from '../components/home/CategoryRail';
import Hero from '../components/home/Hero';
import ProblemSection from '../components/home/ProblemSection';
import DealGrid from '../components/home/DealGrid';
import FarmerSpotlight from '../components/home/FarmerSpotlight';
import ProductRow from '../components/home/ProductRow';

const Home = () => {
  // Mock Data for Rows
  const freshProducts = [
    { id: 1, name: 'Organic Tomatoes', price: 40, unit: 'kg', farmer: 'Green Valley', rating: 4.8, image: 'https://source.unsplash.com/random/400x300/?vegetable&sig=1', featureTag: "Harvested 4h ago" },
    { id: 2, name: 'Fresh Spinach', price: 20, unit: 'bunch', farmer: 'Sunita Devi', rating: 4.9, image: 'https://source.unsplash.com/random/400x300/?spinach&sig=2', featureTag: "Harvested 6h ago" },
    { id: 3, name: 'Red Apples', price: 180, unit: 'kg', farmer: 'Kashmir Orchards', rating: 4.7, image: 'https://source.unsplash.com/random/400x300/?apple&sig=3' },
    { id: 4, name: 'Basmati Rice', price: 120, unit: 'kg', farmer: 'Punjab Fields', rating: 4.9, image: 'https://source.unsplash.com/random/400x300/?rice&sig=4' },
    { id: 5, name: 'Carrots', price: 50, unit: 'kg', farmer: 'Nashik Farms', rating: 4.6, image: 'https://source.unsplash.com/random/400x300/?carrot&sig=5' },
  ];

  const bestSellers = [
    { id: 11, name: 'Alphonso Mangoes', price: 600, unit: 'doz', farmer: 'Ratnagiri Orchards', rating: 4.9, image: 'https://source.unsplash.com/random/400x300/?mango&sig=11', featureTag: "Best Seller" },
    { id: 12, name: 'Strawberries', price: 250, unit: 'box', farmer: 'Mahabaleshwar', rating: 4.8, image: 'https://source.unsplash.com/random/400x300/?strawberry&sig=12' },
    { id: 13, name: 'Gir Cow Ghee', price: 1500, unit: 'ltr', farmer: 'Vedic Daisy', rating: 5.0, image: 'https://source.unsplash.com/random/400x300/?butter&sig=13' },
    { id: 14, name: 'Wild Honey', price: 400, unit: 'bottle', farmer: 'Forest Co-op', rating: 4.9, image: 'https://source.unsplash.com/random/400x300/?honey&sig=14' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">

      {/* 1. Category Rail (Sticky-ish feel) */}
      <CategoryRail />

      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 space-y-12">

        {/* 2. Story-First Hero */}
        <Hero />

        {/* 3. The Silent Pain (Story Element) */}
        <ProblemSection />

        {/* 4. Harvest Highlights (Deal Grid) */}
        <DealGrid />

        {/* 5. Product Row: Fresh This Morning */}
        <ProductRow
          title="Fresh Harvests This Morning"
          icon={Clock}
          products={freshProducts}
          linkText="View Daily Arrivals"
        />

        {/* 6. Farmer Spotlight (Narrative Interstitial) */}
        <FarmerSpotlight />

        {/* 7. Product Row: Best Sellers */}
        <ProductRow
          title="Community Favorites"
          icon={Truck}
          products={bestSellers}
          linkText="Shop Best Sellers"
        />

      </div>
    </div>
  );
};

export default Home;
