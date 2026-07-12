import React, { useState } from 'react';
import { Mail, Clock, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: 'order', message: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans sm:py-12">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-green-700">Help & support</p>
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">We’re here for the practical stuff</h1>
          <p className="mb-8 leading-relaxed text-gray-600">
            Wrong item, delayed farm pack, account questions, or farm application follow-ups —
            tell us what happened. We’ll point you to the right next step.
          </p>
          <ul className="space-y-4 text-sm text-gray-700">
            <li className="flex gap-3"><Clock className="shrink-0 text-green-600" size={18} /> We aim to reply within 1–2 business days.</li>
            <li className="flex gap-3">
              <Mail className="shrink-0 text-green-600" size={18} />
              <a href="mailto:support@fruitbasket.com" className="tap-target inline-flex items-center break-all hover:text-green-700">
                support@fruitbasket.com
              </a>
            </li>
            <li className="flex gap-3"><MessageSquare className="shrink-0 text-green-600" size={18} /> Order issues: include your FB- order number.</li>
          </ul>
          <p className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-800">
            Contact form currently stores messages in the browser session only (no ticket backend yet).
            Wire SMTP or a helpdesk before treating this as production support.
          </p>
        </div>

        {sent ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Message noted</h2>
            <p className="text-gray-600">
              Thanks, {form.name || 'friend'}. We’ve recorded your note locally for now.
              For urgent order issues, email support@fruitbasket.com with your order ID.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
            <input
              required
              autoComplete="name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="tap-target w-full rounded-2xl bg-gray-50 px-4 text-base"
            />
            <input
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="tap-target w-full rounded-2xl bg-gray-50 px-4 text-base"
            />
            <select
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="tap-target w-full rounded-2xl bg-gray-50 px-4 text-base"
            >
              <option value="order">Order / delivery</option>
              <option value="farm">Farm application</option>
              <option value="account">Account</option>
              <option value="other">Something else</option>
            </select>
            <textarea
              required
              rows={5}
              placeholder="What do you need help with?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-2xl bg-gray-50 p-4 text-base"
            />
            <button type="submit" className="tap-target w-full rounded-2xl bg-green-600 text-sm font-bold text-white">
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
