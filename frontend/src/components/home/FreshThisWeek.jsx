import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '../shared/ProductCard';
import { api } from '../../api';

const FreshThisWeek = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        let { ok, data } = await api('/api/products/featured');
        if (!ok || !Array.isArray(data)) {
          ({ ok, data } = await api('/api/products'));
        }
        if (cancelled) return;
        if (ok && Array.isArray(data)) {
          setProducts(data.slice(0, 8));
        } else {
          setError('Could not load this week’s produce.');
          setProducts([]);
        }
      } catch {
        if (!cancelled) {
          setError('Could not load this week’s produce.');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Fresh this week</h2>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              What&apos;s in season right now, straight from the farm.
            </p>
          </div>
          <Link to="/marketplace" className="tap-target inline-flex items-center gap-1 text-sm font-bold text-green-700">
            Shop marketplace <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-8 text-center">
            <p className="text-sm text-amber-900">{error}</p>
            <Link to="/marketplace" className="mt-3 inline-block text-sm font-bold text-green-700">
              Browse the marketplace →
            </Link>
          </div>
        ) : products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-500">
            New harvest listings will show up here.
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} className="w-[70%] shrink-0 sm:w-auto sm:shrink">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FreshThisWeek;
