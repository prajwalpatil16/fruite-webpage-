import React, { useState } from 'react';
import { User, MapPin, Bell, Shield, CreditCard, LogOut, ChevronRight, Camera } from 'lucide-react';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
        { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
        { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-10 md:py-16 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-center relative">
                                <div className="relative inline-block group cursor-pointer text-white">
                                    <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden mx-auto bg-white/20 flex items-center justify-center text-4xl font-bold">
                                        P
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg text-green-600">
                                        <Camera size={14} />
                                    </div>
                                </div>
                                <h2 className="mt-4 text-white font-bold text-lg">Prajwal Patil</h2>
                                <p className="text-green-50 text-xs opacity-80">Premium Member since 2024</p>
                            </div>

                            <nav className="p-4 space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                            activeTab === tab.id 
                                            ? 'bg-green-50 text-green-600' 
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {tab.icon} {tab.label}
                                        </div>
                                        {activeTab === tab.id && <ChevronRight size={16} />}
                                    </button>
                                ))}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                                        <LogOut size={18} /> Log Out
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[600px] p-6 md:p-10">
                            {activeTab === 'personal' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Personal Information</h3>
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                            <input type="text" defaultValue="Prajwal Patil" className="w-full bg-gray-50 border-gray-200 rounded-2xl px-4 py-3 focus:ring-green-500 focus:border-green-500 font-medium text-gray-700 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                            <input type="email" defaultValue="prajwal@fruite.com" className="w-full bg-gray-50 border-gray-200 rounded-2xl px-4 py-3 focus:ring-green-500 focus:border-green-500 font-medium text-gray-700 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                                            <input type="tel" defaultValue="+91 9876543210" className="w-full bg-gray-50 border-gray-200 rounded-2xl px-4 py-3 focus:ring-green-500 focus:border-green-500 font-medium text-gray-700 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Default Unit</label>
                                            <select className="w-full bg-gray-50 border-gray-200 rounded-2xl px-4 py-3 focus:ring-green-500 focus:border-green-500 font-medium text-gray-700 outline-none transition-all">
                                                <option>Kilograms (kg)</option>
                                                <option>Grams (g)</option>
                                                <option>Pieces (pc)</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 pt-6">
                                            <button className="bg-green-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-transform">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Saved Addresses</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border-2 border-green-500 bg-green-50/30 p-5 rounded-2xl relative shadow-sm">
                                            <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded">Default</div>
                                            <div className="flex items-center gap-2 mb-3 text-green-600 font-bold">
                                                <MapPin size={18} /> Home
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                                42nd Block, Koramangala Layout,<br />
                                                Near 80 Feet Road, Bengaluru,<br />
                                                Karnataka - 560034
                                            </p>
                                            <button className="mt-4 text-xs font-bold text-green-600 hover:text-green-700">Edit Address</button>
                                        </div>
                                        <button className="border-2 border-dashed border-gray-200 p-5 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-600 transition-all group">
                                            <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-sm">Add New Address</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Placeholders for others */}
                            {(activeTab === 'payment' || activeTab === 'notifications' || activeTab === 'security') && (
                                <div className="flex flex-col items-center justify-center h-96 text-center opacity-40">
                                    <MapPin size={48} className="mb-4 text-gray-300" />
                                    <h3 className="text-lg font-bold text-gray-400">Section Under Development</h3>
                                    <p className="text-sm text-gray-400 max-w-xs px-6">We're building more tools to give you full control over your experience.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Plus icon for the addresses tab
const Plus = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default Profile;
