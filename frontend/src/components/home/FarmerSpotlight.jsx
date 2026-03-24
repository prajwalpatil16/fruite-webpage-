import React from 'react';

const FarmerSpotlight = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-green-900 to-emerald-800 rounded-xl overflow-hidden shadow-lg text-white mx-4 sm:mx-0 my-12">
            <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-emerald-300 font-bold tracking-widest text-xs uppercase mb-3 text-emerald-400">Farmer of the Month</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Meet Rajesh & Family</h2>
                <div className="w-12 h-1 bg-yellow-400 mb-6"></div>
                <p className="text-emerald-50 mb-8 leading-relaxed text-lg">
                    "We don't just grow mangoes; we grow memories." <br /><br />
                    Rajesh has been practicing chemical-free farming in Ratnagiri for 15 years. By cutting out middlemen, he now invests 30% more back into his soil health.
                </p>
                <div className="flex gap-4 flex-wrap">
                    <button className="bg-white text-green-900 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                        Read Their Story
                    </button>
                    <button className="border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors backdrop-blur-sm">
                        Shop Rajesh's Harvest
                    </button>
                </div>
            </div>
            <div className="relative h-64 md:h-auto">
                <img src="https://images.unsplash.com/photo-1627916607164-7b5267ad71bb?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover" alt="Farmer Portrait" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-green-900/50"></div>
            </div>
        </div>
    );
};

export default FarmerSpotlight;
