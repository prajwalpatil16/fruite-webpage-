import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { api } from '../../api';

/**
 * Single bottom band — sell CTA + newsletter (avoids two near-identical centered blocks).
 */
const CommunityBand = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const { ok, data } = await api('/api/content/newsletter', {
      method: 'POST',
      body: { email: email.trim() },
    });
    if (ok) {
      setStatus('Thanks — check your inbox soon.');
      setEmail('');
    } else {
      setStatus(data?.msg || 'Could not subscribe.');
    }
  };

  return (
    <section className="bg-[#3d2f24] text-[#f7f3eb]">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative overflow-hidden px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
            aria-hidden
          />
          <div className="relative max-w-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8d9c4]">
              For growers
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Grow it. List it. Get paid for it.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#d4cbc0] sm:text-base">
              Sell directly to customers who want to know where their food comes from. No
              middlemen taking a cut of your work.
            </p>
            <Link
              to="/sell"
              className="tap-target mt-8 inline-flex items-center gap-2 rounded-full bg-[#1f6b3a] px-7 text-sm font-bold text-white transition hover:bg-[#185530]"
            >
              Start Selling <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#2a2119] px-4 py-12 sm:px-8 sm:py-16 lg:border-l lg:border-t-0 lg:px-12">
          <div className="mx-auto max-w-md lg:mx-0">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8d9c4]">
              <Mail size={14} /> Stay in season
            </p>
            <h2 className="font-display mt-3 text-2xl font-semibold sm:text-3xl">
              Recipes &amp; farm stories, twice a month
            </h2>
            <p className="mt-3 text-sm text-[#d4cbc0]">
              No spam — just what&apos;s fresh and what&apos;s new.
            </p>
            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="tap-target flex-1 rounded-full border border-white/15 bg-[#3d2f24] px-5 text-base text-white outline-none placeholder:text-[#9a8f84] focus:border-[#1f6b3a] focus:ring-2 focus:ring-[#1f6b3a]/40 sm:text-sm"
              />
              <button
                type="submit"
                className="tap-target rounded-full bg-[#f7f3eb] px-6 text-sm font-bold text-[#3d2f24] hover:bg-white"
              >
                Subscribe
              </button>
            </form>
            {status && <p className="mt-3 text-sm font-medium text-[#c8d9c4]">{status}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityBand;
