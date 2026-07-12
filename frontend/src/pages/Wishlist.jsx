import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 font-sans">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="text-green-700" size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Your wishlist is quiet</h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Save seasonal favorites here when the feature ships. For now, follow farms you like on the Farmers page
          and add produce straight to your basket when it’s in stock.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/marketplace" className="bg-green-600 text-white font-bold px-6 py-3 rounded-2xl">Browse marketplace</Link>
          <Link to="/farmers" className="bg-white border border-gray-200 font-bold px-6 py-3 rounded-2xl text-gray-800">Meet farms</Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
