import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Cooperative / About page — Part A refined copy hardcoded.
 * Reasoning: marketing pages change infrequently; a full page-CMS adds
 * complexity without much benefit for v1. Journal/Help are CMS-backed instead.
 */
const Cooperative = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <section className="bg-gradient-to-br from-emerald-900 to-green-700 text-white py-14 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-green-200 mb-3">About FruitBasket</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            We&apos;re not a grocery store. We&apos;re a cooperative.
          </h1>
          <p className="text-green-100 text-base sm:text-lg leading-relaxed">
            FruitBasket exists because the distance between farm and table got too long — too many hands,
            too many markups, too much flavor lost along the way.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-8 text-[1.05rem] leading-relaxed text-gray-700">
        <p>
          We built a platform where farmers set their own prices, tell their own stories, and keep the value they create.
          Where customers know exactly whose land their food came from. No corporate produce buyers.
          No unnamed &quot;supplier #4471.&quot; Just farmers and the people who eat what they grow.
        </p>
        <p className="text-gray-900 font-medium">
          When you order from FruitBasket, more of what you pay reaches the person who actually did the work —
          sun, soil, and all.
        </p>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">How an order works</h2>
          <p className="text-gray-600 text-base">
            Your cart can mix farms. At checkout it&apos;s still one purchase for you — behind the scenes,
            each farm packs only their share, with their own fulfillment status.
          </p>
          <Link to="/help/how-does-delivery-work" className="inline-block text-green-700 font-bold text-sm hover:underline">
            Read more in Help Center →
          </Link>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Still open</p>
          <p className="text-sm text-amber-900 leading-relaxed">
            Exact commission / fee terms for farmers aren&apos;t published yet — confirm those before we add them to Help Center.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link to="/marketplace" className="tap-target flex items-center justify-center rounded-2xl bg-green-600 px-6 text-sm font-bold text-white">
            Shop farms
          </Link>
          <Link to="/sell" className="tap-target flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-800">
            Join as a farm
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Cooperative;
