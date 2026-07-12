import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Sprout, Loader2 } from 'lucide-react';
import { api } from '../../api';

const QUICK_SEARCHES = [
  { label: 'Tomatoes', q: 'tomato' },
  { label: 'Mangoes', q: 'mango' },
  { label: 'Leafy greens', q: 'greens' },
  { label: 'Organic', q: 'organic' },
];

/**
 * Single sitewide search — header is the only entry point.
 * Query lives in /marketplace?q=…; live suggestions pull products + farms.
 */
export default function UniversalSearch({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const urlQ = location.pathname.startsWith('/marketplace')
    ? (searchParams.get('q') || '')
    : '';

  const [query, setQuery] = useState(urlQ);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ products: [], farms: [] });

  useEffect(() => {
    setQuery(urlQ);
  }, [urlQ]);

  useEffect(() => {
    if (mobileOpen && inputRef.current) inputRef.current.focus();
  }, [mobileOpen]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults({ products: [], farms: [] });
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const { ok, data } = await api(`/api/products/search?q=${encodeURIComponent(q)}`);
      if (ok) setResults({ products: data.products || [], farms: data.farms || [] });
      else setResults({ products: [], farms: [] });
      setLoading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const goMarketplace = (q) => {
    const term = (q ?? query).trim();
    navigate(term ? `/marketplace?q=${encodeURIComponent(term)}` : '/marketplace');
    setFocused(false);
    onMobileClose?.();
  };

  const showPanel = focused && (query.trim().length >= 2 || mobileOpen);

  const panel = (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {loading && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Searching…
        </div>
      )}
      {!loading && query.trim().length >= 2 && results.products.length === 0 && results.farms.length === 0 && (
        <p className="px-4 py-3 text-sm text-gray-500">No matches for “{query.trim()}”</p>
      )}
      {results.products.length > 0 && (
        <div className="border-b border-gray-100 py-2">
          <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Produce</p>
          <ul>
            {results.products.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link
                  to={`/product/${p.id}`}
                  onClick={() => { setFocused(false); onMobileClose?.(); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50"
                >
                  <img
                    src={p.image_url || 'https://via.placeholder.com/40'}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{p.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {p.farmer_name} · ₹{p.price}/{p.unit}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {results.farms.length > 0 && (
        <div className="border-b border-gray-100 py-2">
          <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Farms</p>
          <ul>
            {results.farms.slice(0, 4).map((f) => (
              <li key={f.id}>
                <Link
                  to={`/marketplace?farmer=${f.id}`}
                  onClick={() => { setFocused(false); onMobileClose?.(); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <Sprout size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{f.farm_name}</p>
                    <p className="truncate text-xs text-gray-500">{f.location}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {query.trim().length < 2 && (
        <div className="py-2">
          <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Try searching</p>
          {QUICK_SEARCHES.map((item) => (
            <button
              key={item.q}
              type="button"
              onClick={() => goMarketplace(item.q)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-800 hover:bg-green-50"
            >
              <Search size={14} className="text-gray-400" /> {item.label}
            </button>
          ))}
        </div>
      )}
      {query.trim().length >= 2 && (
        <button
          type="button"
          onClick={() => goMarketplace()}
          className="flex w-full items-center justify-center gap-2 bg-green-50 px-4 py-3 text-sm font-bold text-green-800 hover:bg-green-100"
        >
          See all results for “{query.trim()}”
        </button>
      )}
    </div>
  );

  if (mobileOpen) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden">
        <form
          onSubmit={(e) => { e.preventDefault(); goMarketplace(); }}
          className="flex items-center gap-2 border-b border-gray-200 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
        >
          <button type="button" onClick={onMobileClose} className="tap-target flex items-center justify-center text-gray-500" aria-label="Close search">
            <X size={22} />
          </button>
          <div className="relative min-w-0 flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search produce, farms…"
              className="tap-target w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-base outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <button type="submit" className="tap-target shrink-0 px-2 text-sm font-bold text-green-700">Go</button>
        </form>
        <div className="flex-1 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {panel}
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative hidden min-w-0 flex-1 md:block">
      <form
        onSubmit={(e) => { e.preventDefault(); goMarketplace(); }}
        className="relative"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search vegetables, fruits, farms…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-11 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/30"
          aria-label="Universal search"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-green-700"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </form>
      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2">
          {panel}
        </div>
      )}
    </div>
  );
}
