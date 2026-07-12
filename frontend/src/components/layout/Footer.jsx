import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../Logo';
import { api } from '../../api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    const { ok } = await api('/api/content/newsletter', {
      method: 'POST',
      body: { email: email.trim() },
    });
    setNote(ok ? 'Thanks — you are on the list.' : 'Could not subscribe right now.');
    if (ok) setEmail('');
  };

  return (
    <footer className="bg-gray-900 pb-10 pt-12 text-white sm:pb-8 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mb-12 lg:grid-cols-4 lg:gap-12">
          <div>
            <Logo variant="white" height={44} className="mb-4" />
            <p className="mb-5 text-sm leading-relaxed text-gray-400">
              Food tastes better when you know who grew it. Independent farms, one checkout, fair packing.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="tap-target flex items-center justify-center rounded-full text-gray-400 hover:text-green-400"
                  aria-label="Social link"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-white">Explore</h4>
            <ul className="space-y-1">
              {[
                ['/marketplace', 'Marketplace'],
                ['/farmers', 'Our Farmers'],
                ['/journal', 'Journal'],
                ['/help', 'Help Center'],
                ['/sell', 'Sell on FruitBasket'],
                ['/cooperative', 'The Cooperative'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="tap-target inline-flex items-center text-sm text-gray-400 hover:text-green-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>123 Farmer&apos;s Lane, Agricultural District, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <a href="tel:+919876543210" className="tap-target inline-flex items-center hover:text-green-400">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <a href="mailto:support@fruitbasket.com" className="tap-target inline-flex items-center break-all hover:text-green-400">
                  support@fruitbasket.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-white">Stay fresh</h4>
            <p className="mb-4 text-sm text-gray-400">
              Seasonal updates and new farms — no spam.
            </p>
            <form className="flex flex-col gap-3" onSubmit={subscribe}>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="tap-target rounded-xl border-none bg-gray-800 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="tap-target rounded-xl bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700"
              >
                Subscribe
              </button>
              {note && <p className="text-xs text-green-300">{note}</p>}
            </form>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} FruitBasket Cooperative</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/help" className="tap-target inline-flex items-center hover:text-white">Help</Link>
            <Link to="/returns" className="tap-target inline-flex items-center hover:text-white">Returns</Link>
            <Link to="/contact" className="tap-target inline-flex items-center hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
