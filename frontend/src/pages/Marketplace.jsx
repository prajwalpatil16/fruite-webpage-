
import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Heart } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';

const Marketplace = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(100);

    const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Herbs'];

    // Mock Data
    const products = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        name: ['Organic Tomatoes', 'Fresh Spinach', 'Red Apples', 'Basmati Rice', 'Carrots', 'Potatoes'][i % 6],
        category: ['Vegetables', 'Vegetables', 'Fruits', 'Grains', 'Vegetables', 'Vegetables'][i % 6],
        price: 40 + (i * 10),
        unit: 'kg',
        farmer: 'Green Valley Farm',
        rating: 4.8,
        image: `https://source.unsplash.com/random/400x300/?vegetable,fruit&sig=${i}`,
        imageFallback: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000'
    }));

    const filteredProducts = products.filter(p =>
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        p.price <= priceRange
    );

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                        <p className="text-gray-600">Fresh produce directly from local farmers</p>
                    </div>
                    <div className="mt-4 md:mt-0 relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold text-lg">
                                <Filter size={20} /> Filters
                            </div>

                            <div className="mb-8">
                                <h3 className="font-medium mb-3 text-gray-700">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                className="text-green-600 focus:ring-green-500"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(cat)}
                                            />
                                            <span className={selectedCategory === cat ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3 text-gray-700">Max Price: ₹{priceRange}</h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-green-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>₹0</span>
                                    <span>₹200+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <button
                                    onClick={() => { setSelectedCategory('All'); setPriceRange(200); }}
                                    className="mt-4 text-green-600 font-medium hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
