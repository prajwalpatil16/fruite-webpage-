import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../api';

const ImpactNumbers = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await api('/api/products/impact-stats');
        if (!cancelled && ok) setStats(data);
      } catch {
        /* leave stats null */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-8">
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-green-600" />
        </div>
      </section>
    );
  }

  if (!stats) return null;

  const items = [
    { value: stats.farms, label: 'farms' },
    { value: stats.orders, label: 'orders' },
    { value: stats.regions, label: 'regions' },
  ];
  if (stats.avg_fulfillment_hours != null) {
    items.push({ value: `~${stats.avg_fulfillment_hours}h`, label: 'avg harvest→door' });
  }

  const early = (stats.farms || 0) < 10 || (stats.orders || 0) < 50;

  return (
    <section className="border-y border-gray-100 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f6b3a]">
              Live from the database
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-[#3d2f24] sm:text-3xl">
              Real numbers, real impact
            </h2>
            {early && (
              <p className="mt-2 text-sm text-gray-500">
                Just getting started — and growing. These are live counts, not goals.
              </p>
            )}
          </div>
          <dl className="grid flex-1 grid-cols-3 gap-4 sm:max-w-lg sm:gap-6">
            {items.map((c) => (
              <div key={c.label} className="text-center sm:text-right">
                <dt className="sr-only">{c.label}</dt>
                <dd className="font-display text-3xl font-semibold tabular-nums text-[#1f6b3a] sm:text-4xl">
                  {c.value}
                </dd>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {c.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
        {stats.avg_fulfillment_hours == null && (
          <p className="mt-5 text-center text-[11px] text-gray-400 sm:text-left">
            Avg. harvest-to-delivery hours will appear once we have enough delivered orders to
            calculate honestly.
          </p>
        )}
      </div>
    </section>
  );
};

export default ImpactNumbers;
