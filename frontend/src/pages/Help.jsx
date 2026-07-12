import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Loader2, Search } from 'lucide-react';
import { api } from '../api';

const Help = () => {
  const [articles, setArticles] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = q.trim() ? `/api/content/help?q=${encodeURIComponent(q.trim())}` : '/api/content/help';
    const t = setTimeout(() => {
      setLoading(true);
      api(path).then(({ ok, data }) => {
        if (ok) setArticles(data);
        setLoading(false);
      });
    }, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [q]);

  const grouped = useMemo(() => {
    const map = {};
    for (const a of articles) {
      if (!map[a.category]) map[a.category] = [];
      map[a.category].push(a);
    }
    return map;
  }, [articles]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <section className="bg-white border-b border-gray-100 py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3 flex items-center justify-center gap-2">
            <HelpCircle size={14} /> Help Center
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Practical answers, not corporate FAQ fluff
          </h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Ordering, delivery, payments, returns, and selling on FruitBasket.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="search"
              inputMode="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search help articles…"
              className="tap-target w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-base outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-500 py-12">No articles match that search.</p>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-4">{category}</h2>
                <ul className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                  {items.map((a) => (
                    <li key={a.id}>
                      <Link
                        to={`/help/${a.slug}`}
                        className="tap-target flex items-center px-5 text-sm font-medium text-gray-800 transition-colors hover:bg-green-50 hover:text-green-800 sm:px-6 sm:text-base"
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-12">
          Still stuck?{' '}
          <Link to="/contact" className="text-green-700 font-bold hover:underline">Contact Help & Support</Link>
        </p>
      </div>
    </div>
  );
};

export default Help;
