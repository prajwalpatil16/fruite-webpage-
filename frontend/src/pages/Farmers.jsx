import React from 'react';
import { MapPin, Sprout, Star } from 'lucide-react';
import FarmerCard from '../components/shared/FarmerCard';

const Farmers = () => {
    const farmers = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        name: ['Ramesh Kumar', 'Sunita Devi', 'Green Earth Co-op', 'Rajesh Farming', 'Organic Oasys', 'Natures Best'][i % 6],
        location: ['Nasik, MH', 'Pune, MH', 'Nagpur, MH', 'Satara, MH', 'Kolhapur, MH', 'Solapur, MH'][i % 6],
        type: ['Organic', 'Hydroponic', 'Traditional', 'Natural Farming'][i % 4],
        rating: 4.5 + (i % 5) * 0.1,
        image: `https://source.unsplash.com/random/400x300/?farmer,person&sig=${i}`,
        imageFallback: 'https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?auto=format&fit=crop&q=80&w=1000'
    }));

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Farmers</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        The hardworking people who bring fresh produce to your table.
                        Connect with them directly and support local agriculture.
                    </p>
                </div>

                {/* Filters (Simple top bar for now) */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    {['All', 'Organic', 'Natural', 'Hydroponic'].map((filter) => (
                        <button key={filter} className="px-6 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-600 transition-colors shadow-sm cursor-pointer">
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {farmers.map((farmer) => (
                        <FarmerCard key={farmer.id} farmer={farmer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Farmers;
