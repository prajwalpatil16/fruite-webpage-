import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FarmerCTA = () => (
  <section className="bg-gradient-to-br from-green-800 to-emerald-700 py-14 text-white sm:py-20">
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
        Grow it. List it. Get paid for it.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-green-100 sm:text-base">
        Join FruitBasket and sell directly to customers who want to know where their food comes from.
        No middlemen taking a cut of your work.
      </p>
      <Link
        to="/sell"
        className="tap-target mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-green-800 shadow-lg transition hover:bg-green-50"
      >
        Start Selling <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

export default FarmerCTA;
