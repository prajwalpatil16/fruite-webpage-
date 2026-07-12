import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Sprout, Loader2 } from 'lucide-react';
import { api } from '../api';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const highlight = params.get('highlight');

  useEffect(() => {
    api('/api/products/farmers').then(({ ok, data }) => {
      if (ok) setFarmers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* For customers */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-green-200 mb-3">Our farmers</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Know who grew it. Buy from them by name.
          </h1>
          <p className="text-green-100 text-lg max-w-2xl leading-relaxed">
            Every farm on FruitBasket is reviewed before it goes live. You shop listings tied to real people,
            real places, and real harvest weeks — not anonymous bulk supply.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Farms on FruitBasket</h2>
        <p className="text-gray-500 mb-8 text-sm">Approved growers only. Pending applications never appear here.</p>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
        ) : farmers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <Sprout className="mx-auto text-green-600 mb-4" size={36} />
            <p className="font-bold text-gray-900 mb-2">Farms are joining</p>
            <p className="text-gray-500 text-sm mb-6">Check back soon, or be the first to apply.</p>
            <Link to="/sell" className="text-green-700 font-bold hover:underline">Sell on FruitBasket</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((f) => (
              <div
                key={f.id}
                id={`farmer-${f.id}`}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm ${
                  String(highlight) === String(f.id) ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100'
                }`}
              >
                <div className="h-40 bg-gray-100">
                  {f.photo_url ? (
                    <img src={f.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-green-700"><Sprout size={40} /></div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{f.farm_name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {f.location}</p>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">{f.description || 'A FruitBasket farm.'}</p>
                  <p className="text-xs font-bold text-green-700 mt-4">{f.product_count} live listing{f.product_count === 1 ? '' : 's'}</p>
                  <Link to={`/marketplace?farmer=${f.id}`} className="inline-block mt-4 text-sm font-bold text-green-700 hover:underline">
                    Shop this farm →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* For farmers — recruitment */}
      <section className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3">For growers</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Sell under your own farm name</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You keep your story, set your prices, and fulfill only your share of each order.
              We don’t bury you under a private-label brand.
            </p>
            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li>• Apply once — we review before you go live</li>
              <li>• List produce and update stock yourself</li>
              <li>• See only the sub-orders that contain your items</li>
            </ul>
            <Link to="/sell" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-2xl">
              Apply to sell
            </Link>
          </div>
          <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
            <p className="font-bold text-gray-900 mb-2">What we ask of you</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Honest descriptions, stock you can actually pack, and clear communication when something runs short.
              That’s the trust customers come here for — and the bar we hold at approval.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Farmers;
