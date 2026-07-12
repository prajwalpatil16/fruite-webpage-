import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative isolate min-h-[70vh] overflow-hidden bg-gray-900 md:min-h-[78vh]">
      <img
        src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2070"
        className="absolute inset-0 h-full w-full object-cover"
        alt="Fresh vegetables from local farms"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/65" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 py-20 text-center text-white md:min-h-[78vh] md:px-8">
        <p className="mb-5 text-sm font-medium text-green-100/90">
          From the farmer&apos;s soil to the customer&apos;s table
        </p>
        <h1 className="mb-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Food tastes better when{' '}
          <span className="block">you know who grew it.</span>
        </h1>
        <p className="mb-9 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          No middlemen. No hidden margins. Just fresh produce, fair prices, and direct relationships with local farmers.
        </p>
        <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:justify-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-green-500"
          >
            Buy from Farmers <ArrowRight size={18} />
          </Link>
          <Link
            to="/sell"
            className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Sell on FruitBasket
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
