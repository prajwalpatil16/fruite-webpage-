import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Heart, Loader2 } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';

const Marketplace = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(1000);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Vegetables', 'Fruits', 'Exotic'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:5000/api/products';
                const response = await fetch(url);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || 
            (p.category_id === 1 && selectedCategory === 'Fruits') ||
            (p.category_id === 2 && selectedCategory === 'Vegetables') ||
            (p.category_id === 3 && selectedCategory === 'Exotic');
        
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = p.price <= priceRange;
        
        return matchesCategory && matchesSearch && matchesPrice;
    });

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                    max="2000"
                                    step="50"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-green-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>₹0</span>
                                    <span>₹2000+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:w-3/4">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-green-600" size={48} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={{
                                        ...product,
                                        image: product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000'
                                    }} />
                                ))}
                            </div>
                        )}

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
