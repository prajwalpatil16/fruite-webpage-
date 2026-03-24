import React from 'react';
import { Link } from 'react-router-dom';

const mockCategories = [
    { name: 'Fresh Veggies', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=100' },
    { name: 'Seasonal Fruits', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=100' },
    { name: 'Organic Grains', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=100' },
    { name: 'Dairy & Eggs', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=100' },
    { name: 'Spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=100' },
    { name: 'Dried Fruits', img: 'https://images.unsplash.com/photo-1595412017657-6097e9549590?auto=format&fit=crop&q=80&w=100' },
    { name: 'Honey & Jam', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=100' },
];

const CategoryRail = () => {
    return (
        <div className="bg-white p-4 shadow-sm mb-4 border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar text-center pb-2 justify-start md:justify-center">
                {mockCategories.map((cat, i) => (
                    <Link to="/marketplace" key={i} className="flex flex-col items-center gap-2 group min-w-[70px] cursor-pointer">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-green-500 transition-all shadow-sm bg-gray-50">
                            <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-green-600 leading-tight">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryRail;
