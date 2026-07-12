import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package } from 'lucide-react';

const Returns = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <Truck className="text-green-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">Returns & refunds</h1>
        </div>
        <p className="mb-8 leading-relaxed text-gray-600">
          Produce is perishable. We handle problems farm-by-farm when something arrives wrong —
          spoiled, missing, or clearly not what was listed.
        </p>

        <div className="mb-8 space-y-6 rounded-3xl border border-gray-100 bg-white p-8">
          <div>
            <h2 className="mb-2 font-bold text-gray-900">What we can help with</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Items damaged or spoiled on arrival</li>
              <li>• Wrong item packed by a farm</li>
              <li>• Missing items from a farm’s sub-order</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-bold text-gray-900">How to request a return</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Go to{' '}
              <Link to="/orders" className="font-bold text-green-700 hover:underline">My Orders</Link>
              {' '}and tap <strong>Request return</strong> on the item. Choose quantity, add a short reason,
              and the farm will review it. Photos help when produce quality is the question — you can also
              reach{' '}
              <Link to="/contact" className="font-bold text-green-700 hover:underline">Help & Support</Link>.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-green-100 bg-green-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 shrink-0 text-green-700" size={22} />
              <div>
                <p className="font-bold text-green-900">Ready to start a return?</p>
                <p className="mt-1 text-sm text-green-800">
                  Returns are started from your order history — not from this page.
                </p>
              </div>
            </div>
            <Link
              to="/orders"
              className="tap-target inline-flex items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-bold text-white hover:bg-green-700"
            >
              Open My Orders
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-800">Needs your decision</p>
          <p className="text-sm leading-relaxed text-amber-900">
            Final policy terms (window in hours/days, partial refunds vs replacement, who absorbs COD refunds,
            multi-farm dispute ownership) should come from you before we harden this into binding copy.
            Current page is operational guidance only — not a legal policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Returns;
