import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../api';

const StoryProduct = ({ product }) => {
  const image = product.image_url || product.image;
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-2 pr-3 transition hover:border-green-200 hover:bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={image}
        alt=""
        className="h-11 w-11 shrink-0 rounded-lg object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200';
        }}
      />
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-gray-900 group-hover:text-green-800">
          {product.name}
        </p>
        <p className="text-[11px] font-semibold text-green-700">
          ₹{product.price}
          {product.unit ? ` / ${product.unit}` : ''}
        </p>
      </div>
    </Link>
  );
};

const JournalPreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { ok, data } = await api('/api/content/blog');
        if (cancelled) return;
        if (ok && Array.isArray(data)) setPosts(data.slice(0, 3));
        else {
          setError('Could not load journal stories.');
          setPosts([]);
        }
      } catch {
        if (!cancelled) {
          setError('Could not load journal stories.');
          setPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-[#eef5ef] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f6b3a]">
              The Journal
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#3d2f24] sm:text-4xl">
              Stories with something to buy
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600 sm:text-base">
              Guides and farm notes — each paired with best sellers you can order today.
            </p>
          </div>
          <Link
            to="/journal"
            className="tap-target inline-flex items-center gap-1 text-sm font-bold text-green-800"
          >
            All stories <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-8 text-center">
            <p className="text-sm text-amber-900">{error}</p>
            <Link to="/journal" className="mt-3 inline-block text-sm font-bold text-green-700">
              Open the Journal →
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-500">
            Stories are on the way.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <article
                key={post.id}
                className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 ${
                  idx === 0 ? 'lg:col-span-1' : ''
                }`}
              >
                <Link to={`/journal/${post.slug}`} className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">
                    {post.category}
                  </span>
                  <h3 className="font-display mt-2 text-xl font-semibold leading-snug text-[#3d2f24]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 text-sm font-bold text-green-700">Read story →</span>
                </Link>
                {Array.isArray(post.best_sellers) && post.best_sellers.length > 0 && (
                  <div className="border-t border-gray-100 bg-[#fafaf8] px-4 py-3 sm:px-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Best sellers for this story
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {post.best_sellers.slice(0, 2).map((p) => (
                        <StoryProduct key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalPreview;
