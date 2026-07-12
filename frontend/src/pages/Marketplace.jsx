import React, { useState, useEffect } from 'react';
import { Filter, Loader2, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/shared/ProductCard';
import { api } from '../api';

const FilterPanel = ({
  categoryOptions,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="mb-3 text-sm font-bold text-gray-800">Category</h3>
      <div className="space-y-1">
        {categoryOptions.map((cat) => (
          <label key={cat} className="tap-target flex cursor-pointer items-center gap-3 rounded-xl px-2 hover:bg-gray-50">
            <input
              type="radio"
              name="category"
              className="h-4 w-4 accent-green-600"
              checked={selectedCategory === cat}
              onChange={() => setSelectedCategory(cat)}
            />
            <span className="text-sm text-gray-700">{cat}</span>
          </label>
        ))}
      </div>
    </div>
    <div>
      <h3 className="mb-3 text-sm font-bold text-gray-800">Max price: ₹{priceRange}</h3>
      <input
        type="range"
        min="50"
        max="2000"
        step="50"
        value={priceRange}
        onChange={(e) => setPriceRange(Number(e.target.value))}
        className="w-full accent-green-600"
        aria-label="Maximum price"
      />
    </div>
  </div>
);

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(2000);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = searchParams.get('q') || '';
  const farmer = searchParams.get('farmer') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (farmer) params.set('farmer_id', farmer);
      const qs = params.toString();
      const path = qs ? `/api/products?${qs}` : '/api/products';
      const [p, c] = await Promise.all([api(path), api('/api/products/categories')]);
      if (p.ok) setProducts(p.data);
      if (c.ok) setCategories(c.data);
      setLoading(false);
    };
    fetchData();
  }, [q, farmer]);

  const filteredProducts = products.filter((p) => {
    const catName = p.category_name || categories.find((c) => c.id === p.category_id)?.name;
    const matchesCategory =
      selectedCategory === 'All' ||
      catName === selectedCategory ||
      (selectedCategory === 'Exotic' && catName === 'Exotics');
    const matchesPrice = p.price <= priceRange;
    return matchesCategory && matchesPrice;
  });

  const categoryOptions = ['All', ...categories.map((c) => c.name)];

  const clearQuery = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Marketplace</h1>
          <p className="mt-1 text-sm text-gray-600">
            Produce from approved FruitBasket farms — not a warehouse.
          </p>
          {q && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800">
                Results for “{q}”
              </span>
              <button
                type="button"
                onClick={clearQuery}
                className="tap-target inline-flex items-center gap-1 rounded-full px-3 text-sm font-bold text-gray-500 hover:text-gray-800"
              >
                <X size={14} /> Clear search
              </button>
            </div>
          )}
          {farmer && !q && (
            <p className="mt-3 text-sm text-green-700">
              Showing produce from one farm.{' '}
              <Link to="/marketplace" className="font-bold underline">Show all farms</Link>
            </p>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="text-sm text-gray-500">{filteredProducts.length} items</p>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="tap-target inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
                <Filter size={18} /> Filters
              </div>
              <FilterPanel
                categoryOptions={categoryOptions}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-green-600" size={40} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                <p className="font-bold text-gray-900">No produce matches</p>
                <p className="mt-2 text-sm text-gray-500">Try another search in the header, or clear filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="tap-target flex items-center justify-center rounded-full bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel
              categoryOptions={categoryOptions}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="tap-target mt-6 w-full rounded-2xl bg-green-600 text-sm font-bold text-white"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
