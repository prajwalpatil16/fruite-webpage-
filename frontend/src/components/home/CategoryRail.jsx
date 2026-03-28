import React from 'react';
import { Link } from 'react-router-dom';

const mockCategories = [
    { name: 'Fresh Veggies', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=100' },
    { name: 'Seasonal Fruits', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=100' },
    { name: 'Organic Grains', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=100' },
    { name: 'Dairy & Eggs', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=100' },
    { name: 'Spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=100' },
    { name: 'Dried Fruits', img: 'https://images.unsplash.com/photo-1596510344078-04ff5823190b?auto=format&fit=crop&q=80&w=100' },
    { name: 'Honey & Jam', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=100' },
];

const CategoryRail = () => {
    return (
        <div className="bg-white p-4 shadow-sm mb-4 border-b border-gray-100 sticky top-16 z-40">
            <div className="max-w-7xl mx-auto relative">
                {/* Horizontal Fade Cues */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden" />
                
                <div className="flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar text-center pb-2 px-2">
                    {mockCategories.map((cat, i) => (
                        <Link to="/marketplace" key={i} className="flex flex-col items-center gap-3 group min-w-[80px] cursor-pointer shrink-0 transition-transform active:scale-95">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-green-500 group-hover:shadow-md transition-all bg-gray-50 flex-shrink-0">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-xs font-bold text-gray-700 group-hover:text-green-600 leading-tight transition-colors">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryRail;
