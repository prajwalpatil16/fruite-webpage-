import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../api';
import { RichText } from '../components/shared/RichText';
import ProductCard from '../components/shared/ProductCard';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api(`/api/content/blog/${slug}`).then(({ ok, data }) => {
      if (ok) setPost(data);
      else setError(data?.msg || 'Post not found');
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold">Post not found</h1>
        <Link to="/journal" className="font-bold text-green-700 hover:underline">
          Back to Journal
        </Link>
      </div>
    );
  }

  const sellers = Array.isArray(post.best_sellers) ? post.best_sellers : [];

  return (
    <article className="min-h-screen bg-[#fafaf8] font-sans">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          to="/journal"
          className="tap-target mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700"
        >
          <ArrowLeft size={16} /> Journal
        </Link>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-green-700">
          {post.category}
        </p>
        <h1 className="font-display mb-4 text-3xl font-semibold leading-tight text-[#3d2f24] sm:text-4xl">
          {post.title}
        </h1>
        <p className="mb-8 text-sm text-gray-400 sm:mb-10">
          {post.author_name || 'FruitBasket'}
          {post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString()}` : ''}
        </p>
        <RichText content={post.body} className="pb-10" />

        {sellers.length > 0 && (
          <aside className="mt-4 border-t border-gray-200 pt-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
              Best sellers for this story
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-[#3d2f24]">
              Taste what you just read about
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {sellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
