import React, { useState } from 'react';
import { ArrowLeft, Check, Lock, CreditCard, Truck, User, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { cart, getCartTotal } = useCart();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

    const subtotal = getCartTotal();
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;

    if (step === 3) {
        return (
            <div className="bg-white min-h-screen py-20 flex flex-col items-center justify-center font-sans px-4">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 relative">
                    <Check size={48} className="text-green-600" />
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 text-center">Order Placed Successfully!</h1>
                <p className="text-gray-500 text-center mb-10 max-w-md font-medium">
                    Thank you for supporting local farmers! We've received your order and our partners are currently picking the freshest produce for you.
                </p>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 w-full max-w-md mb-10">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Summary</p>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold"><span className="text-gray-600">Order ID:</span> <span className="text-gray-900">FB-1002931</span></div>
                        <div className="flex justify-between text-sm font-bold"><span className="text-gray-600">Items:</span> <span className="text-gray-900">{cart.length} Products</span></div>
                        <div className="flex justify-between text-sm font-bold"><span className="text-gray-600">Estimated Delivery:</span> <span className="text-green-600 italic">Tomorrow, 10 AM</span></div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link to="/orders" className="flex-1 bg-green-600 text-white font-bold py-4 rounded-2xl text-center shadow-lg shadow-green-600/30 hover:shadow-xl transition-all">Track My Order</Link>
                    <Link to="/" className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl text-center hover:bg-gray-200 transition-colors">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 md:py-16 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-10">
                    <Link to="/cart" className="p-2 bg-white rounded-full text-gray-400 hover:text-green-600 shadow-sm border border-gray-100 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Steps & Forms */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Step Indicators */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${step === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                <Truck size={16} /> Shipping
                            </div>
                            <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${step === 2 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <CreditCard size={16} /> Payment
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User size={20} className="text-green-600" /> Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase ml-1">First Name</label><input type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-green-500 outline-none font-medium" /></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase ml-1">Last Name</label><input type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-green-500 outline-none font-medium" /></div>
                                    <div className="md:col-span-2 space-y-2"><label className="text-xs font-bold text-gray-400 uppercase ml-1">Street Address</label><input type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-green-500 outline-none font-medium" /></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase ml-1">City</label><input type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-green-500 outline-none font-medium" /></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase ml-1">ZIP Code</label><input type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-green-500 outline-none font-medium" /></div>
                                </div>
                                <button onClick={() => setStep(2)} className="mt-10 w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/30 hover:-translate-y-0.5 transition-all">
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard size={20} className="text-green-600" /> Payment Details
                                </h2>
                                <div className="space-y-6">
                                    <div className="p-4 border-2 border-green-500 bg-green-50 rounded-2xl flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-green-600">COD</div>
                                            <span className="font-bold text-gray-800">Cash on Delivery</span>
                                        </div>
                                        <Check className="text-green-500" />
                                    </div>
                                    <div className="p-4 border-2 border-gray-100 rounded-2xl flex items-center justify-between cursor-not-allowed opacity-50 grayscale">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-100 p-2 rounded-lg font-bold text-gray-400">CC</div>
                                            <span className="font-bold text-gray-400">Credit / Debit Card</span>
                                        </div>
                                        <div className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">Coming Soon</div>
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">Go Back</button>
                                    <button onClick={() => setStep(3)} className="flex-[2] bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/30 hover:-translate-y-0.5 transition-all">
                                        Place Order (₹{total})
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">In Your Basket</h3>
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                            <div className="border-t border-gray-100 pt-6 space-y-3">
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Subtotal</span> <span className="text-black font-bold">₹{subtotal}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Delivery</span> <span className="text-green-600 font-black tracking-tighter">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                                    <span className="text-gray-900 font-black uppercase text-xs tracking-widest">Total</span>
                                    <span className="text-xl font-black text-green-600 underline underline-offset-4 decoration-green-100 decoration-4">₹{total}</span>
                                </div>
                            </div>
                            <div className="mt-8 bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 flex gap-3 text-xs">
                                <Info size={28} className="text-blue-500 flex-shrink-0" />
                                <p className="text-gray-500 font-medium leading-relaxed">Delivery estimated by <strong>Tomorrow, 10:00 AM</strong></p>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                                <Lock size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit SSL encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
