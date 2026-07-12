import React, { useEffect, useState } from 'react';
import { User, MapPin, LogOut, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

const Profile = () => {
  const { user, token, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newAddr, setNewAddr] = useState({ details: '', city: '', pincode: '', state: '', address_type: 'home' });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    setName(user?.name || '');
    setPhone(user?.phone || '');

    const load = async () => {
      await refreshProfile();
      const { ok, data } = await api('/api/addresses', { token });
      if (ok) setAddresses(data);
      setLoading(false);
    };
    load();
  }, [token]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { ok, data } = await api('/api/auth/profile', {
      method: 'PUT',
      token,
      body: { name, phone },
    });
    setSaving(false);
    if (ok) {
      await refreshProfile();
      setMessage('Profile updated.');
    } else {
      setMessage(data?.msg || 'Could not save.');
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    const { ok, data } = await api('/api/addresses', {
      method: 'POST',
      token,
      body: { ...newAddr, is_default: addresses.length === 0 },
    });
    if (ok) {
      setAddresses((prev) => [...prev, data]);
      setNewAddr({ details: '', city: '', pincode: '', state: '', address_type: 'home' });
    } else {
      alert(data?.msg || 'Could not add address');
    }
  };

  const deleteAddress = async (id) => {
    const { ok } = await api(`/api/addresses/${id}`, { method: 'DELETE', token });
    if (ok) setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 font-sans sm:py-10 md:py-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-gray-900 sm:gap-3 sm:text-3xl">
              <User className="text-green-600" /> Your profile
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              This is how FruitBasket knows you — keep it current for deliveries.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="tap-target inline-flex shrink-0 items-center gap-2 text-sm font-bold text-red-600"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        <form onSubmit={saveProfile} className="space-y-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Full name</label>
            <input
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="tap-target mt-2 w-full rounded-2xl bg-gray-50 px-4 font-medium outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Email</label>
            <input value={user?.email || ''} disabled className="tap-target mt-2 w-full rounded-2xl bg-gray-100 px-4 font-medium text-gray-500" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Phone</label>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="tap-target mt-2 w-full rounded-2xl bg-gray-50 px-4 font-medium outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="text-sm text-gray-500">
            Role: <strong className="capitalize text-gray-800">{user?.role}</strong>
            {user?.role === 'farmer' && (
              <span className="ml-2">· Farm status: <strong className="capitalize">{user.farmer_status}</strong></span>
            )}
          </div>
          {message && <p className="text-sm font-medium text-green-700">{message}</p>}
          <button type="submit" disabled={saving} className="tap-target w-full rounded-2xl bg-green-600 px-6 text-sm font-bold text-white disabled:opacity-50 sm:w-auto">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
            <MapPin className="text-green-600" size={20} /> Delivery addresses
          </h2>

          <div className="mb-8 space-y-3">
            {addresses.length === 0 && (
              <p className="text-sm text-gray-500">No addresses yet. Add one before your next checkout.</p>
            )}
            {addresses.map((a) => (
              <div key={a.id} className="flex justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold capitalize text-gray-900">{a.address_type}{a.is_default ? ' · Default' : ''}</p>
                  <p className="mt-1 text-sm text-gray-600">{a.details}</p>
                  <p className="mt-1 text-xs text-gray-500">{a.city}, {a.state} — {a.pincode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteAddress(a.id)}
                  className="tap-target flex shrink-0 items-center justify-center text-red-500 hover:text-red-700"
                  aria-label="Delete address"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={addAddress} className="space-y-4 border-t border-gray-100 pt-6">
            <p className="flex items-center gap-2 text-sm font-bold text-gray-800"><Plus size={16} /> Add address</p>
            <input
              required
              autoComplete="street-address"
              placeholder="Street address"
              value={newAddr.details}
              onChange={(e) => setNewAddr({ ...newAddr, details: e.target.value })}
              className="tap-target w-full rounded-2xl bg-gray-50 px-3 outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                required
                autoComplete="address-level2"
                placeholder="City"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="tap-target rounded-2xl bg-gray-50 px-3 outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                required
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="PIN"
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                className="tap-target rounded-2xl bg-gray-50 px-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <input
              required
              autoComplete="address-level1"
              placeholder="State"
              value={newAddr.state}
              onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
              className="tap-target w-full rounded-2xl bg-gray-50 px-3 outline-none focus:ring-2 focus:ring-green-500"
            />
            <button type="submit" className="tap-target inline-flex items-center font-bold text-green-700">
              Save address
            </button>
          </form>
        </div>

        {user?.role === 'farmer' && user?.farmer_status === 'approved' && (
          <Link to="/farmer" className="tap-target flex items-center justify-center rounded-2xl bg-green-600 text-sm font-bold text-white">
            Open My Farm Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Profile;
