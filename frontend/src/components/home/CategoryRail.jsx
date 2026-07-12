import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Fresh Veggies',
    to: '/marketplace',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Seasonal Fruits',
    to: '/marketplace?q=fruit',
    img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Organic',
    to: '/marketplace?q=organic',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Exotics',
    to: '/marketplace?q=exotic',
    img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Organic Grains',
    to: '/marketplace',
    img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Dairy & Eggs',
    to: '/marketplace',
    img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Spices',
    to: '/marketplace',
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Dried Fruits',
    to: '/marketplace',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Honey & Jam',
    to: '/marketplace',
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Our Farmers',
    to: '/farmers',
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3036?auto=format&fit=crop&w=200&q=80',
  },
];

const FALLBACK =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';

const CategoryRail = () => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-start md:justify-center gap-5 md:gap-8 overflow-x-auto hide-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group flex w-[4.75rem] md:w-24 shrink-0 flex-col items-center gap-2 text-center"
            >
              <div className="h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-full border border-gray-100 bg-gray-50 shadow-sm transition-all group-hover:border-green-500 group-hover:shadow-md">
                <img
                  src={cat.img}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK;
                  }}
                />
              </div>
              <span className="w-full text-[11px] md:text-xs font-semibold leading-tight text-gray-700 group-hover:text-green-700">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryRail;
