import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative rounded-xl overflow-hidden shadow-md h-[400px] md:h-[500px] bg-gray-900 group mx-4 sm:mx-0 mt-4 sm:mt-0">
            <img
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2070"
                className="w-full h-full object-cover opacity-60"
                alt="Hero"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center p-8 md:p-16">
                <div className="max-w-3xl text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                        From the farmer’s soil to the customer’s soul
                    </span>
                    <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                        Food tastes better when <br className="hidden md:block" /> you know who grew it.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-2xl mx-auto">
                        No middlemen. No hidden margins. Just fresh produce, fair prices, and direct relationships with local farmers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/marketplace" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
                            Buy from Farmers <ArrowRight size={20} />
                        </Link>
                        <Link to="/register" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold transition-all inline-flex items-center justify-center">
                            Become a Partner
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
