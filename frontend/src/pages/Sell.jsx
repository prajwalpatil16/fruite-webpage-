import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sell = () => {
  const { registerFarmer, loading, user, isFarmer } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    farm_name: '',
    location: '',
    description: '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await registerFarmer(form);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.message || 'Could not submit application');
    }
  };

  if (user && isFarmer) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <Clock className="mx-auto text-amber-500 mb-4" size={40} />
        <h1 className="text-2xl font-bold mb-3">You already have a farm account</h1>
        <p className="text-gray-500 mb-6">
          {user.farmer_status === 'approved'
            ? 'Your farm is live. Head to your dashboard to list produce.'
            : user.farmer_status === 'rejected'
              ? 'Your last application was not approved. Check your status page for the reason.'
              : 'Your application is still under review.'}
        </p>
        <Link
          to="/farmer"
          className="text-green-700 font-bold hover:underline"
        >
          Continue
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Application received</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thanks for applying to sell on FruitBasket. We review every farm before it goes live —
          usually within a few business days. You can sign in anytime to check your status.
        </p>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8">
          {/* BUSINESS DECISION: confirm exact SLA */}
          Review window shown as “a few business days” — confirm the exact SLA you want customers and farmers to see.
        </p>
        <button onClick={() => navigate('/login')} className="bg-green-600 text-white font-bold px-8 py-3 rounded-2xl">
          Sign in to track status
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans sm:py-12">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3 flex items-center gap-2">
            <Sprout size={14} /> Sell on FruitBasket
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Grow it. List it. Get paid for it — no middlemen taking a cut of your work.
          </h1>
          <p className="text-gray-600 leading-relaxed mb-4 text-base sm:text-lg">
            Selling on FruitBasket takes minutes to set up. You control your prices, your listings, and your story.
            Customers see your farm, not a warehouse barcode.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Getting started is simple: register with your farm details, and after a short trust review you&apos;re live
            on the marketplace. No warehouse contracts. No renaming your harvest.
          </p>
          <ul className="space-y-3 text-sm text-gray-700 mb-8">
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" /> You set prices and write your farm story</li>
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" /> You pack only your share of multi-farm orders</li>
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" /> Short approval before listings go public — keeps buyer trust high</li>
          </ul>
          <p className="text-sm text-gray-500">
            Already shopping with us?{' '}
            <Link to="/login" className="text-green-700 font-bold hover:underline">Sign in</Link>
            {' '}or use a dedicated farm email to apply.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="mb-2 text-xl font-bold text-gray-900">Farm application</h2>
          {[
            ['name', 'Your name', 'text', 'name'],
            ['email', 'Email', 'email', 'email'],
            ['phone', 'Phone', 'tel', 'tel'],
            ['password', 'Password (min 6 characters)', 'password', 'new-password'],
            ['farm_name', 'Farm name', 'text', undefined],
            ['location', 'Farm location (village / district / state)', 'text', undefined],
          ].map(([name, label, type, autoComplete]) => (
            <div key={name}>
              <label className="text-xs font-bold uppercase text-gray-400">{label}</label>
              <input
                required={name !== 'phone'}
                type={type}
                name={name}
                autoComplete={autoComplete}
                inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined}
                value={form[name]}
                onChange={onChange}
                className="tap-target mt-1 w-full rounded-2xl bg-gray-50 px-3 text-base outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Short farm story</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={onChange}
              placeholder="What do you grow? How long have you farmed? What should customers know?"
              className="mt-1 w-full rounded-2xl bg-gray-50 p-3 text-base outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="tap-target w-full rounded-2xl bg-green-600 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? <Loader2 className="mx-auto animate-spin" /> : 'Submit application'}
          </button>
          <p className="text-center text-xs text-gray-400">
            Pending farms cannot list products or appear in the marketplace until approved.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Sell;
