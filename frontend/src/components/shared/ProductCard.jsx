import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative">
            <div className="h-40 md:h-52 overflow-hidden relative bg-gray-100">
                <img
                    src={product.image}
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-all z-10 shadow-sm hover:scale-110">
                    <Heart size={18} />
                </button>
                {product.featureTag && (
                    <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                        {product.featureTag}
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="mb-2">
                    <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 hover:text-green-600 cursor-pointer transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium italic">by {product.farmer}</p>
                </div>

                {/* Rating Row */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex bg-green-600 text-white text-[10px] items-center px-1.5 py-0.5 rounded-md gap-0.5 shadow-sm">
                        <span className="font-bold">{product.rating}</span> <Star size={8} fill="currentColor" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">(456 reviews)</span>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">per {product.unit}</span>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            className="p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-600 hover:text-white transition-all transform active:scale-95 shadow-sm hover:shadow-green-200"
                        >
                            <ShoppingCart size={20} />
                        </button>
                    </div>
                    <div className="text-[10px] text-green-600 font-medium mt-2 flex items-center gap-1">
                        <span>FREE Delivery</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">By Tomorrow</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
