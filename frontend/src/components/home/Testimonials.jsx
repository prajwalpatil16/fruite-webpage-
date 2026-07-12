import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Loader2 } from 'lucide-react';
import { api } from '../../api';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFailed(false);
      try {
        const { ok, data } = await api('/api/products/reviews/featured');
        if (cancelled) return;
        if (ok && Array.isArray(data)) setReviews(data);
        else setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-10 sm:py-12">
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-green-600" />
        </div>
      </section>
    );
  }

  // Built + wired — hide quietly when there are no approved reviews yet (no fake quotes)
  if (!reviews.length) {
    if (failed) {
      return (
        <section className="bg-white py-8">
          <p className="text-center text-sm text-gray-400">
            Customer reviews will appear here once they&apos;re approved.
          </p>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">What people are saying</h2>
          <p className="mt-2 text-sm text-gray-600">Real reviews from FruitBasket customers.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <blockquote
              key={r.id}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:p-6"
            >
              <div className="mb-3 flex gap-0.5 text-amber-500">
                {Array.from({ length: Math.min(5, r.rating || 0) }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-gray-700">&ldquo;{r.body}&rdquo;</p>
              <footer className="mt-4 text-xs font-bold text-gray-500">
                {r.user_name || 'Customer'}
                {r.product_name ? ` · ${r.product_name}` : ''}
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          Bought something recently?{' '}
          <Link to="/orders" className="font-semibold text-green-700 hover:underline">
            Leave a review from your orders
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
