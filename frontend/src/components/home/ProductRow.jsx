import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../shared/ProductCard';

const ProductRow = ({ title, icon: Icon, products, linkText = "See all" }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm relative border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {Icon && <Icon size={22} className="text-green-600" />} {title}
                </h2>
                <Link to="/marketplace" className="text-green-700 text-sm font-semibold hover:underline flex items-center gap-1">
                    {linkText}
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                {products.map((product) => (
                    <div key={product.id} className="min-w-[200px] md:min-w-[240px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductRow;
