import React from 'react';
import { MapPin, Sprout, Star } from 'lucide-react';

const FarmerCard = ({ farmer }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group">
            <div className="h-48 overflow-hidden relative">
                <img
                    src={farmer.image}
                    onError={(e) => e.target.src = farmer.imageFallback || 'https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?auto=format&fit=crop&q=80&w=1000'}
                    alt={farmer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="text-white text-sm font-medium hover:underline cursor-pointer">View Profile</button>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{farmer.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin size={16} className="mr-1" /> {farmer.location}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded flex items-center">
                        <Sprout size={12} className="mr-1" /> {farmer.type}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded flex items-center">
                        <Star size={12} className="mr-1" /> {farmer.rating}
                    </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-500 text-sm truncate">
                        {farmer.specialties || 'Specializes in fresh local produce...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FarmerCard;
