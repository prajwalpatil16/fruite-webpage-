import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const mockWishlist = [
    { id: 'w1', name: 'Fresh Dragon Fruit', price: 180, unit: 'pc', image: 'https://images.unsplash.com/photo-1527325511917-418382f679f3?auto=format&fit=crop&q=80&w=300' },
    { id: 'w2', name: 'Pomegranate Premium', price: 250, unit: 'kg', image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=300' },
];

const Wishlist = () => {
    const { addToCart } = useCart();

    return (
        <div className="bg-gray-50 min-h-screen py-10 md:py-16 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                            <Heart className="text-red-500 fill-red-500" size={28} /> My Wishlist
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">You have {mockWishlist.length} saved favorites</p>
                    </div>
                </div>

                {mockWishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockWishlist.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="relative overflow-hidden h-48">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-4 tracking-wider">₹{item.price} / {item.unit}</p>
                                    <button 
                                        onClick={() => addToCart({ ...item, quantity: 1 })}
                                        className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 font-bold py-3 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <ShoppingBag size={18} /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-6">
                            <Heart size={32} className="text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                            Save products you're interested in while you shop. Check back whenever you're ready!
                        </p>
                        <Link to="/marketplace" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-green-600/30 hover:scale-105 transition-all">
                            Browse Marketplace <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
