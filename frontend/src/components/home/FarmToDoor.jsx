import React from 'react';
import { Sprout, PackageCheck, Truck, Home } from 'lucide-react';

const steps = [
  {
    n: '01',
    icon: Sprout,
    title: 'Harvested to order',
    text: 'Farmers pick your produce after you order, not weeks before.',
  },
  {
    n: '02',
    icon: PackageCheck,
    title: 'Packed same day',
    text: 'No cold storage, no sitting in a distribution center.',
  },
  {
    n: '03',
    icon: Truck,
    title: 'On its way within hours',
    text: 'Delivered directly from the farm’s region to you.',
  },
  {
    n: '04',
    icon: Home,
    title: 'On your table',
    text: 'Peak freshness — the way it’s supposed to taste.',
  },
];

/** Product journey as a vertical/horizontal path — distinct from How It Works cards. */
const FarmToDoor = () => (
  <section className="bg-[#1f6b3a] py-12 text-white sm:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-green-200/90">
          The produce path
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          From farm to your door
        </h2>
        <p className="mt-3 text-sm text-green-100/90 sm:text-base">
          No warehouses. No weeks in transit. Here&apos;s what actually happens to your order.
        </p>
      </div>

      <ol className="relative grid gap-0 sm:grid-cols-4">
        {/* Desktop connector line */}
        <div
          className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-green-400/40 sm:block"
          aria-hidden
        />
        {steps.map(({ n, icon: Icon, title, text }, i) => (
          <li
            key={n}
            className={`relative flex gap-4 border-l border-green-400/30 py-4 pl-5 sm:block sm:border-l-0 sm:py-0 sm:pl-0 ${
              i === steps.length - 1 ? 'border-l-transparent' : ''
            }`}
          >
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border-2 border-green-300/50 bg-[#185530] sm:mx-auto">
              <Icon size={20} className="text-green-100" />
            </div>
            <div className="sm:mt-5 sm:px-2 sm:text-center">
              <span className="font-mono text-[10px] font-bold tracking-widest text-green-300">
                {n}
              </span>
              <h3 className="mt-1 text-base font-bold sm:text-lg">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-green-100/85">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default FarmToDoor;
