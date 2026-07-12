import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, BookOpen } from 'lucide-react';
import { api } from '../api';

const PAGE_SIZE = 6;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    api('/api/content/blog').then(({ ok, data }) => {
      if (ok) setPosts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [category]);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = category === 'All' ? posts : posts.filter((p) => p.category === category);
  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="bg-gradient-to-br from-green-900 to-emerald-700 px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-200">
            <BookOpen size={14} /> Journal
          </p>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Stories from the farm and the table
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-green-100 sm:text-lg">
            How FruitBasket works, what&apos;s in season, and why knowing who grew your food still matters.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-4">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`tap-target whitespace-nowrap rounded-full px-4 text-sm font-bold transition-colors ${
                category === c ? 'bg-green-600 text-white' : 'border border-gray-200 bg-white text-gray-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-green-600" size={40} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-gray-500">No posts in this category yet.</p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              {shown.map((post) => (
                <Link
                  key={post.id}
                  to={`/journal/${post.slug}`}
                  className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-green-100 hover:shadow-md sm:p-8"
                >
                  <span className="mb-3 text-[10px] font-bold uppercase tracking-widest text-green-700">
                    {post.category}
                  </span>
                  <h2 className="mb-3 text-xl font-extrabold leading-snug text-gray-900 sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 text-sm font-bold text-green-700">Read more →</span>
                </Link>
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="tap-target rounded-2xl border border-gray-200 bg-white px-8 text-sm font-bold text-gray-800 hover:border-green-300 hover:text-green-800"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
