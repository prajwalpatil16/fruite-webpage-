import React from 'react';

const ProblemSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
                    <div className="border-l-4 border-gray-100 pl-6 py-2">
                        <p className="text-lg text-gray-900 font-semibold mb-1">Farmers grow with care,</p>
                        <p className="text-gray-500">but sell without power.</p>
                    </div>
                    <div className="border-l-4 border-gray-100 pl-6 py-2">
                        <p className="text-lg text-gray-900 font-semibold mb-1">Customers buy food,</p>
                        <p className="text-gray-500">without knowing its journey.</p>
                    </div>
                    <div className="border-l-4 border-gray-100 pl-6 py-2">
                        <p className="text-lg text-gray-900 font-semibold mb-1">Middlemen decide prices,</p>
                        <p className="text-gray-500">not the people.</p>
                    </div>
                </div>

                <h3 className="text-2xl md:text-4xl font-serif italic text-gray-800 leading-relaxed max-w-3xl mx-auto">
                    “Fruit Basket removes the distance between food and people.”
                </h3>
            </div>
        </section>
    );
};

export default ProblemSection;
