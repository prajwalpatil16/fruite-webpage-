import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../api';
import { RichText } from '../components/shared/RichText';

const HelpArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api(`/api/content/help/${slug}`).then(({ ok, data }) => {
      if (ok) setArticle(data);
      else setError(data?.msg || 'Article not found');
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-3">Article not found</h1>
        <Link to="/help" className="text-green-700 font-bold hover:underline">Back to Help Center</Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link to="/help" className="tap-target mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700">
          <ArrowLeft size={16} /> Help Center
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-3">{article.category}</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-6 sm:mb-8">
          {article.title}
        </h1>
        <RichText content={article.body} className="pb-12" />
        <div className="border-t border-gray-100 pt-6 text-sm text-gray-500">
          Need more help?{' '}
          <Link to="/contact" className="text-green-700 font-bold hover:underline">Contact us</Link>
        </div>
      </div>
    </article>
  );
};

export default HelpArticle;
