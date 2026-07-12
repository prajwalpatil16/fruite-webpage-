import React from 'react';
import { Search, Package, Truck } from 'lucide-react';

const steps = [
  {
    n: '1',
    icon: Search,
    title: 'Browse & Order',
    text: 'Shop fresh produce straight from local farms, all in one place.',
  },
  {
    n: '2',
    icon: Package,
    title: 'Farmers Prepare Fresh',
    text: 'Your order is picked and packed after you order — not weeks in advance.',
  },
  {
    n: '3',
    icon: Truck,
    title: 'Delivered to You',
    text: 'Track your delivery in real time, farm to doorstep.',
  },
];

const HowItWorks = () => (
  <section className="bg-white py-10 sm:py-14">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f6b3a]">
          For shoppers
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold text-[#3d2f24] sm:text-4xl">
          How it works
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Your actions — browse, order, receive. (The produce path is next.)
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-3 sm:gap-8">
        {steps.map(({ n, icon: Icon, title, text }) => (
          <div key={n} className="relative border-t-4 border-[#1f6b3a] bg-gray-50 px-5 pb-6 pt-5 sm:px-6">
            <span className="font-mono text-xs font-bold text-[#1f6b3a]">Step {n}</span>
            <Icon className="mt-3 text-[#1f6b3a]" size={26} />
            <h3 className="mt-3 text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
