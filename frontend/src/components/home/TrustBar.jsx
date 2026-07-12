import React from 'react';
import { Sprout, Clock, Link2, BadgeCheck } from 'lucide-react';

const items = [
  {
    icon: Sprout,
    title: 'Local farms',
    text: 'Direct from growers in your region',
  },
  {
    icon: Clock,
    title: 'Harvested to order',
    text: 'Picked after you buy — not weeks ahead',
  },
  {
    icon: Link2,
    title: 'Zero middlemen',
    text: 'Farmers keep what they earn',
  },
  {
    icon: BadgeCheck,
    title: 'Verified sellers',
    text: 'Every farm reviewed before listing',
  },
];

const TrustBar = () => (
  <section className="border-b border-green-100 bg-green-50/70">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
            <Icon size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 sm:text-base">{title}</p>
            <p className="mt-0.5 text-xs leading-snug text-gray-600 sm:text-sm">{text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBar;
