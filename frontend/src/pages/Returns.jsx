import React from 'react';
import { RefreshCcw, ArrowLeftRight, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockReturns = [
  {
    id: 'RET-1022',
    orderId: 'ORD-8799',
    item: 'Fresh Strawberries (500g)',
    date: 'March 15, 2026',
    status: 'Refund Processed',
    reason: 'Quality issue'
  }
];

const Returns = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <RefreshCcw className="text-green-600" size={28} /> Returns & Refunds
        </h1>

        {/* Info Box */}
        <div className="bg-green-600 rounded-2xl p-6 md:p-8 text-white mb-10 shadow-lg shadow-green-900/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Our Freshness Guarantee</h2>
            <p className="text-green-50 opacity-90 text-sm max-w-2xl leading-relaxed">
              Not happy with the quality? We offer immediate returns and refunds for any produce that doesn't meet your expectations. Your satisfaction is the heart of our farmer-to-consumer promise.
            </p>
          </div>
          <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast Process</p>
              <h3 className="font-bold text-gray-900 leading-tight">48hr Refunds</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <ArrowLeftRight size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Easy Exchange</p>
              <h3 className="font-bold text-gray-900 leading-tight">Farmer Pickups</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quality First</p>
              <h3 className="font-bold text-gray-900 leading-tight">No Questions Asked</h3>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Recent Requests</h2>
        {mockReturns.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Return Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-900">{ret.item}</p>
                      <p className="text-xs text-gray-400 font-medium">Order: {ret.orderId} • {ret.reason}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">{ret.date}</td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                        {ret.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No returns found</h3>
            <p className="text-sm text-gray-500 mb-6">You haven't requested any returns or refunds yet. Fresh items arriving soon!</p>
            <Link to="/orders" className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors inline-block">
              Check Previous Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Returns;
