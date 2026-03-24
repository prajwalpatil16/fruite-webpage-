import React from 'react';
import { Link } from 'react-router-dom';

const DealGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 sm:px-0">
            {[
                { title: "Fresh Vegetables", img: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=500", label: "Seasonal Picks" },
                { title: "Sweet Fruits", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=500", label: "Orchard Fresh" },
                { title: "Pantry Staples", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=500", label: "Farmer Brand" },
                { title: "Meet the Growers", img: "https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?auto=format&fit=crop&q=80&w=500", label: "Join Community", link: "/farmers" },
            ].map((card, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-shadow h-full flex flex-col border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">{card.title}</h3>
                    <div className="flex-1 rounded-lg overflow-hidden mb-3 relative h-48 md:h-auto">
                        <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-tr-lg">
                            {card.label}
                        </div>
                    </div>
                    <Link to={card.link || "/marketplace"} className="text-sm text-green-700 font-medium hover:underline">Explore Collection</Link>
                </div>
            ))}
        </div>
    );
};

export default DealGrid;
