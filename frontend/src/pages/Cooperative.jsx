import React from 'react';
import { Users, TrendingUp, Heart, ShieldCheck } from 'lucide-react';

const Cooperative = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-green-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">The FruitBasket Cooperative</h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        A community-owned platform where farmers get fair value and customers get real food.
                        Together, we are rewriting the rules of the food system.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Exist</h2>
                            <p className="text-gray-600 mb-4 text-lg">
                                Traditional supply chains are broken. Farmers get pennies for their produce while customers pay a premium for stale food that has traveled continets.
                            </p>
                            <p className="text-gray-600 mb-6 text-lg">
                                FruitBasket eliminates the middlemen. We provide the technology and logistics to connect farmers directly with consumers.
                            </p>
                            <div className="pl-6 border-l-4 border-green-500 italic text-gray-700 text-xl font-medium">
                                "It's not just a marketplace; it's a movement to reclaim our food sovereignty."
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?auto=format&fit=crop&q=80&w=400" className="rounded-lg shadow-lg mt-8" alt="Farmer" />
                            <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400" className="rounded-lg shadow-lg" alt="Community" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Shared Value for Everyone</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <TrendingUp className="text-green-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-3">Fair Prices</h3>
                            <p className="text-gray-600">Farmers set their own prices. We take a minimal flat fee for operations. No hidden commissions.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <ShieldCheck className="text-blue-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-3">Verified Quality</h3>
                            <p className="text-gray-600">Every farmer is vetted. We encourage organic and natural farming practices for healthier produce.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <Users className="text-purple-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-3">Community First</h3>
                            <p className="text-gray-600">Profits are reinvested into the community to build cold storage and better logistics for farmers.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cooperative;
