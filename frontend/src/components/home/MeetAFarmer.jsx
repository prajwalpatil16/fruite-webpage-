import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Sprout } from 'lucide-react';
import { api } from '../../api';

const MeetAFarmer = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { ok, data } = await api('/api/content/blog?category=Farmer%20Spotlight');
        if (cancelled) return;
        if (ok && Array.isArray(data) && data.length) setPost(data[0]);
        else setError(true);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-10 sm:py-12">
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-green-600" />
        </div>
      </section>
    );
  }

  if (!post) {
    if (error) {
      return (
        <section className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
            <Link to="/journal" className="text-sm font-bold text-green-700">
              Read farmer stories in the Journal →
            </Link>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-2xl sm:mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Meet the people behind your produce
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Every farm on FruitBasket has a story. Here&apos;s one of them.
          </p>
        </div>

        <Link
          to={`/journal/${post.slug}`}
          className="flex flex-col overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white transition hover:border-green-200 hover:shadow-md sm:flex-row"
        >
          <div className="flex aspect-[16/10] items-center justify-center bg-green-100/80 sm:aspect-auto sm:min-h-[220px] sm:w-2/5">
            <Sprout className="text-green-700" size={64} />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">
              {post.category}
            </span>
            <h3 className="mt-2 text-xl font-extrabold leading-snug text-gray-900 sm:text-2xl">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              {post.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-green-700">
              Read their story <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default MeetAFarmer;
