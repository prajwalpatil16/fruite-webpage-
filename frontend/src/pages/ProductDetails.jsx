import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShieldCheck, Truck, Star, ArrowLeft, Leaf, Droplet, Sun, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    
    // Mock product data fetch based on ID
    const product = {
        id,
        name: 'Organic Alfonso Mangoes',
        price: 300,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
        reviews: 128,
        description: 'Directly sourced from the sun-drenched orchards of Ratnagiri, our Alfonso mangoes are known for their buttery texture and honey-like sweetness. Hand-picked at perfect maturity to ensure the most vibrant flavor profile.',
        farmer: 'Ramesh Patil',
        location: 'Ratnagiri, Maharashtra',
        nutrition: {
            calories: '60 kcal',
            vitaminC: '60%',
            potassium: '168mg'
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            {/* Nav Header */}
            <div className="bg-gray-50 border-b border-gray-100 py-4 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link to="/marketplace" className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold transition-colors">
                        <ArrowLeft size={20} /> Back to Market
                    </Link>
                    <div className="flex gap-4">
                        <button className="p-2.5 bg-white shadow-sm border border-gray-200 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Image Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="rounded-[40px] overflow-hidden bg-gray-50 aspect-square shadow-xl shadow-gray-200/50">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-5 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Organic Certified</span>
                            <div className="flex items-center gap-1 text-amber-500 ml-2">
                                <Star size={14} className="fill-amber-500" />
                                <span className="text-sm font-black">{product.rating}</span>
                                <span className="text-gray-400 text-xs font-bold">({product.reviews} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h1>
                        <p className="text-3xl font-black text-green-600 mb-8 flex items-baseline gap-1">
                            ₹{product.price} <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">/ {product.unit}</span>
                        </p>

                        <div className="space-y-6 mb-10">
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {product.description}
                            </p>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-3xl text-center">
                                    <Leaf className="mx-auto mb-2 text-green-600" size={24} />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">100% Raw</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-3xl text-center">
                                    <Droplet className="mx-auto mb-2 text-blue-500" size={24} />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Pesticide Free</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-3xl text-center">
                                    <Sun className="mx-auto mb-2 text-amber-500" size={24} />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Sun Ripened</p>
                                </div>
                            </div>
                        </div>

                        {/* Farmer Section */}
                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center gap-6 mb-10 shadow-sm shadow-green-900/5">
                            <div className="w-16 h-16 rounded-2xl bg-green-200 flex items-center justify-center text-green-700 text-2xl font-black">
                                {product.farmer[0]}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Harvested By</p>
                                <h4 className="text-lg font-bold text-gray-900 leading-none mb-1">{product.farmer}</h4>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5"><MapPin size={14} /> {product.location}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-10">
                            <div className="flex items-center bg-gray-100 p-2 rounded-2xl border border-gray-100">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-xl">-</button>
                                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-xl">+</button>
                            </div>
                            <button 
                                onClick={() => addToCart({ ...product, quantity })}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-green-600/30 hover:shadow-green-600/40 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <ShoppingBag size={24} /> Add to Cart
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-3 text-gray-500">
                                <ShieldCheck size={20} className="text-green-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">Quality Inspected</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <Truck size={20} className="text-green-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">Flash Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
