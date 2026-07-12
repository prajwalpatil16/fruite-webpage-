import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Lock, CreditCard, Truck, User, Info, Loader2, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const Checkout = () => {
  const { cart, getCartTotal, clearCart, cartByFarmer } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [farmerOrderCount, setFarmerOrderCount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingData, setShippingData] = useState({
    details: '', city: '', zip: '', state: '', address_type: 'home',
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const subtotal = getCartTotal();
  const delivery = subtotal > 500 ? 0 : 50;
  const total = subtotal + delivery;
  const groups = cartByFarmer();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (cart.length === 0 && step !== 3) {
      // allow empty only after success
    }
    const load = async () => {
      const { ok, data } = await api('/api/addresses', { token });
      if (ok) {
        setAddresses(data);
        const def = data.find((a) => a.is_default) || data[0];
        if (def) setSelectedAddressId(def.id);
      }
    };
    load();
  }, [token]);

  const saveNewAddress = async () => {
    if (!shippingData.details || !shippingData.city || !shippingData.zip || !shippingData.state) {
      alert('Please fill in address, city, PIN, and state.');
      return;
    }
    setSavingAddress(true);
    const { ok, data } = await api('/api/addresses', {
      method: 'POST',
      token,
      body: {
        details: shippingData.details,
        city: shippingData.city,
        pincode: shippingData.zip,
        state: shippingData.state,
        address_type: shippingData.address_type,
        is_default: addresses.length === 0,
      },
    });
    setSavingAddress(false);
    if (ok) {
      setAddresses((prev) => [...prev, data]);
      setSelectedAddressId(data.id);
      setStep(2);
    } else {
      alert(data?.msg || 'Could not save address');
    }
  };

  const continueFromShipping = () => {
    if (selectedAddressId) {
      setStep(2);
      return;
    }
    saveNewAddress();
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!selectedAddressId) {
      alert('Please select or save a delivery address.');
      setStep(1);
      return;
    }
    if (cart.length === 0) {
      alert('Your basket is empty.');
      navigate('/marketplace');
      return;
    }

    setLoading(true);
    const { ok, data } = await api('/api/orders', {
      method: 'POST',
      token,
      body: { address_id: selectedAddressId, payment_method: 'cod' },
    });
    setLoading(false);

    if (ok) {
      setOrderId(data.order_id);
      setFarmerOrderCount(data.farmer_order_count || groups.length);
      clearCart();
      setStep(3);
    } else {
      alert(data?.msg || 'Order failed');
    }
  };

  if (step === 3) {
    return (
      <div className="bg-white min-h-screen py-20 flex flex-col items-center justify-center font-sans px-4">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 relative">
          <Check size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 text-center">Order on its way to the farms</h1>
        <p className="text-gray-500 text-center mb-10 max-w-md font-medium">
          Thanks, {user?.name?.split(' ')[0] || 'friend'}. Your basket was split across{' '}
          <strong>{farmerOrderCount || 'your'} farm{farmerOrderCount === 1 ? '' : 's'}</strong> so each grower can pack their own share.
        </p>
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 w-full max-w-md mb-10">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order confirmation</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-gray-600">Order ID</span>
              <span className="text-gray-900">FB-{orderId}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-gray-600">Payment</span>
              <span className="text-green-700">Cash on delivery</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to="/orders" className="flex-1 bg-green-600 text-white font-bold py-4 rounded-2xl text-center shadow-lg shadow-green-600/30">
            Track my order
          </Link>
          <Link to="/" className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl text-center">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 font-sans sm:py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
          <Link to="/cart" className="tap-target flex items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-sm hover:text-green-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Checkout</h1>
        </div>

        {/* Mobile running total */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-green-100 bg-green-50 px-4 py-3 lg:hidden">
          <span className="text-sm font-medium text-green-900">Order total</span>
          <span className="text-lg font-black text-green-700">₹{total}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-8">
            <div className="mb-2 flex items-center gap-2 overflow-x-auto hide-scrollbar sm:gap-4 sm:mb-8">
              <div className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold sm:px-4 sm:text-sm ${step === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                <Truck size={16} /> Delivery
              </div>
              <div className="h-0.5 w-6 shrink-0 rounded-full bg-gray-200 sm:w-12" />
              <div className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold sm:px-4 sm:text-sm ${step === 2 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <CreditCard size={16} /> Payment
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:space-y-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
                  <MapPin size={20} className="text-green-600" /> Where should we deliver?
                </h2>

                {addresses.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved addresses</p>
                    {addresses.map((a) => (
                      <label
                        key={a.id}
                        className={`block p-4 rounded-2xl border-2 cursor-pointer ${selectedAddressId === a.id ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="sr-only"
                          checked={selectedAddressId === a.id}
                          onChange={() => setSelectedAddressId(a.id)}
                        />
                        <p className="font-bold text-gray-900 text-sm capitalize">{a.address_type}</p>
                        <p className="text-sm text-gray-600 mt-1">{a.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{a.city}, {a.state} — {a.pincode}</p>
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedAddressId(null)}
                      className="text-sm font-bold text-green-700 hover:underline"
                    >
                      + Add a new address
                    </button>
                  </div>
                )}

                {!selectedAddressId && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="ml-1 text-xs font-bold uppercase text-gray-400">Street address</label>
                      <input
                        type="text"
                        autoComplete="street-address"
                        value={shippingData.details}
                        onChange={(e) => setShippingData({ ...shippingData, details: e.target.value })}
                        className="tap-target w-full rounded-2xl border-0 bg-gray-50 p-4 font-medium outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="House / flat, street, landmark"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-xs font-bold uppercase text-gray-400">City</label>
                      <input
                        type="text"
                        autoComplete="address-level2"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="tap-target w-full rounded-2xl border-0 bg-gray-50 p-4 font-medium outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-xs font-bold uppercase text-gray-400">PIN code</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        value={shippingData.zip}
                        onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                        className="tap-target w-full rounded-2xl border-0 bg-gray-50 p-4 font-medium outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="ml-1 text-xs font-bold uppercase text-gray-400">State</label>
                      <input
                        type="text"
                        autoComplete="address-level1"
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        className="tap-target w-full rounded-2xl border-0 bg-gray-50 p-4 font-medium outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={continueFromShipping}
                  disabled={savingAddress}
                  className="tap-target w-full rounded-2xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-600/30 disabled:opacity-50"
                >
                  {savingAddress ? <Loader2 className="mx-auto animate-spin" /> : 'Continue to payment'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
                  <CreditCard size={20} className="text-green-600" /> How will you pay?
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-green-500 bg-green-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-green-600">COD</div>
                      <div>
                        <span className="font-bold text-gray-800 block">Cash on delivery</span>
                        <span className="text-xs text-gray-500">Pay when your produce arrives</span>
                      </div>
                    </div>
                    <Check className="text-green-500" />
                  </div>
                  <div className="p-4 border-2 border-gray-100 rounded-2xl flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded-lg font-bold text-gray-400">UPI</div>
                      <span className="font-bold text-gray-400">Cards & UPI</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">Coming soon</span>
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                  <button type="button" onClick={() => setStep(1)} className="tap-target flex-1 rounded-2xl border-2 border-gray-100 text-sm font-bold text-gray-500">
                    Go back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="tap-target flex-[2] rounded-2xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-600/30 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="mx-auto animate-spin" /> : `Place order · ₹${total}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-gray-900">In your basket</h3>
              <div className="space-y-6 mb-6 max-h-[360px] overflow-y-auto">
                {groups.map((group) => (
                  <div key={group.farmer_id || group.farm_name}>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-3">
                      From: {group.farm_name} — {group.items.length} item{group.items.length === 1 ? '' : 's'}
                    </p>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden">
                              <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="max-w-[120px]">
                              <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-400 font-black">QTY: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-black text-gray-700">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Subtotal</span> <span className="font-bold">₹{subtotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Delivery</span> <span className="text-green-600 font-black">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-gray-900 font-black uppercase text-xs tracking-widest">Total</span>
                  <span className="text-xl font-black text-green-600">₹{total}</span>
                </div>
              </div>
              <div className="mt-6 bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 flex gap-3 text-xs">
                <Info size={22} className="text-blue-500 flex-shrink-0" />
                <p className="text-gray-500 font-medium leading-relaxed">
                  Farms pack on different schedules. Your order stays one purchase — each farm updates its own status.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <Lock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Account-secured checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
