import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    return (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full relative">
            <div className="h-40 md:h-48 overflow-hidden relative bg-gray-100">
                <img
                    src={product.image}
                    onError={(e) => e.target.src = product.imageFallback || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-10">
                    <Heart size={16} />
                </button>
                {product.featureTag && (
                    <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        {product.featureTag}
                    </span>
                )}
            </div>

            <div className="p-3 flex flex-col flex-1">
                <div className="mb-1">
                    <h3 className="font-medium text-gray-900 text-base leading-tight line-clamp-2 hover:text-green-600 cursor-pointer">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">by {product.farmer}</p>
                </div>

                {/* Rating Row */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex bg-green-600 text-white text-[10px] items-center px-1 rounded gap-0.5">
                        <span className="font-bold">{product.rating}</span> <Star size={8} fill="currentColor" />
                    </div>
                    <span className="text-xs text-gray-400">(456)</span>
                </div>

                <div className="mt-auto pt-2 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                            <span className="text-xs text-gray-400">per {product.unit}</span>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                        >
                            <ShoppingCart size={18} />
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
