import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, MapPin, ChevronDown, Package, Heart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-gray-100 text-xs py-1 px-4 hidden md:block border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-gray-600">
          <div className="flex items-center gap-4">
            <span className="hover:text-green-600 cursor-pointer transition-colors">Sell on FruitBasket</span>
            <span className="hover:text-green-600 cursor-pointer transition-colors">Download App</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 cursor-pointer hover:text-green-600"><MapPin size={12} /> Delivey to: <strong>Login to Set Location</strong></span>
            <Link to="/contact" className="hover:text-green-600 cursor-pointer">Help & Support</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4 sm:gap-8">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600">
                <Menu size={24} />
              </button>
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tighter">
                FruitBasket
              </Link>
            </div>

            {/* Search Bar - The Centerpiece */}
            <div className="flex-1 max-w-2xl hidden md:flex relative">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search for fresh vegetables, fruits, farmers..."
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-4 pr-12 py-2.5 transition-all group-hover:bg-white group-hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={20} className="text-gray-400 group-hover:text-green-600" />
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 sm:gap-6">

              {/* Account Dropdown Trigger */}
              <div className="hidden md:flex flex-col cursor-pointer group relative">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  Hello, Sign in
                </div>
                <div className="flex items-center gap-1 font-bold text-sm text-gray-800 group-hover:text-green-600">
                  Account & Lists <ChevronDown size={14} />
                </div>
                {/* Dropdown (Hover) */}
                <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-lg p-2 hidden group-hover:block transition-all transform origin-top-right z-50">
                  <Link to="/login" className="block w-full text-center bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 rounded mb-2 shadow-sm">Sign In</Link>
                  <div className="text-xs text-center text-gray-500 mb-2 border-b border-gray-100 pb-2">New customer? <Link to="/register" className="text-blue-600 hover:underline">Start here.</Link></div>
                  <ul className="text-sm text-gray-700 space-y-2 pl-2">
                    <li className="hover:text-green-600 cursor-pointer">Your Orders</li>
                    <li className="hover:text-green-600 cursor-pointer">Your Wishlist</li>
                    <li className="hover:text-green-600 cursor-pointer">Sell Products</li>
                  </ul>
                </div>
              </div>

              {/* Returns & Orders */}
              <Link to="/orders" className="hidden md:flex flex-col cursor-pointer hover:opacity-80">
                <span className="text-xs text-gray-500">Returns</span>
                <span className="font-bold text-sm text-gray-800">& Orders</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center gap-2 cursor-pointer hover:text-green-600 relative">
                <div className="relative">
                  <ShoppingCart size={28} />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white">0</span>
                </div>
                <span className="hidden md:block font-bold text-sm">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search - Visible only on mobile */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search FruitBasket..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Secondary Nav - Categories */}
          <div className="flex items-center gap-6 overflow-x-auto text-sm font-medium text-gray-700 pb-2 hide-scrollbar">
            <div className="flex items-center gap-1 cursor-pointer hover:text-green-600 whitespace-nowrap">
              <Menu size={18} /> All
            </div>
            {['Fresh Vegetables', 'Seasonal Fruits', 'Organic Grains', 'Dairy & Eggs', 'Best Sellers', 'New Arrivals', 'Farmer Spotlight'].map(item => (
              <Link key={item} to="/marketplace" className="hover:text-green-600 whitespace-nowrap transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col">
              <div className="bg-green-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <User size={24} className="bg-white/20 p-1 rounded-full text-white box-content" />
                  Browse
                </div>
                <button onClick={() => setIsOpen(false)}><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-lg font-bold text-gray-900 mb-4">Trending</div>
                <ul className="space-y-4 text-gray-600 mb-6 border-b border-gray-100 pb-6">
                  <li>Best Sellers</li>
                  <li>New Releases</li>
                  <li>Movers & Shakers</li>
                </ul>

                <div className="text-lg font-bold text-gray-900 mb-4">Shop By Category</div>
                <ul className="space-y-4 text-gray-600">
                  <li>Vegetables</li>
                  <li>Fruits</li>
                  <li>Grains</li>
                  <li>Dairy</li>
                </ul>
              </div>
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setIsOpen(false)}></div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
