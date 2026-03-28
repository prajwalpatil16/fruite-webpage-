import React from 'react';
import { Package, Truck, CheckCircle, ChevronRight, Clock } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-88219',
    date: 'March 24, 2026',
    total: 850,
    status: 'Delivered',
    items: [
      { name: 'Organic Alfonso Mangoes', qty: 2, price: 300, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=200' },
      { name: 'Fresh Spinach', qty: 1, price: 50, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200' }
    ]
  },
  {
    id: 'ORD-88102',
    date: 'March 20, 2026',
    total: 1200,
    status: 'In Transit',
    items: [
      { name: 'Basmati Rice (5kg)', qty: 1, price: 1200, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' }
    ]
  }
];

const Orders = () => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <CheckCircle size={14} />;
      case 'In Transit': return <Truck size={14} />;
      case 'Processing': return <Clock size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="text-green-600" size={28} /> My Orders
        </h1>

        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order Placed</p>
                    <p className="text-sm font-bold text-gray-700">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                    <p className="text-sm font-bold text-gray-700">₹{order.total}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ship To</p>
                    <p className="text-sm font-bold text-gray-700">Prajwal Patil</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Order # {order.id}</p>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-50" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tight">Qty: {item.qty} × ₹{item.price}</p>
                        <div className="mt-3 flex gap-3">
                          <button className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors">
                            Buy it again <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col gap-2">
                        <button className="w-32 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-700">Track Package</button>
                        <button className="w-32 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-700">Get Help</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
