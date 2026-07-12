import React, { useState } from 'react';
import { api } from '../../api';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const { ok, data } = await api('/api/content/newsletter', {
      method: 'POST',
      body: { email: email.trim() },
    });
    if (ok) {
      setStatus('Thanks — check your inbox soon.');
      setEmail('');
    } else {
      setStatus(data?.msg || 'Could not subscribe.');
    }
  };

  return (
    <section className="border-t border-gray-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Get seasonal recipes and farm stories in your inbox
        </h2>
        <p className="mt-3 text-sm text-gray-600 sm:text-base">
          No spam — just what&apos;s fresh and what&apos;s new, roughly twice a month.
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="tap-target flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-base outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 sm:text-sm"
          />
          <button
            type="submit"
            className="tap-target rounded-2xl bg-green-600 px-6 text-sm font-bold text-white hover:bg-green-700"
          >
            Subscribe
          </button>
        </form>
        {status && <p className="mt-3 text-sm font-medium text-green-700">{status}</p>}
      </div>
    </section>
  );
};

export default NewsletterSignup;
