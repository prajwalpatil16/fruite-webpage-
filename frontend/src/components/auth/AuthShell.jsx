import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

/**
 * Full-viewport auth chrome — no site nav/footer, no page scroll.
 * Form column uses flex + min-h-0 so content fits the screen.
 */
const AuthShell = ({
  children,
  headline,
  subhead,
  asideQuote = 'Know who grew it — and taste the difference.',
  compact = false,
}) => (
  <div className="grid h-dvh max-h-dvh overflow-hidden lg:grid-cols-2">
    <aside className="relative hidden overflow-hidden bg-[#1f6b3a] text-[#f7f3eb] lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.25), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.2), transparent 50%)',
        }}
        aria-hidden
      />
      <div className="relative z-10">
        <Logo variant="white" height={40} />
      </div>
      <div className="relative z-10 max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-200/90">
          Farm to your door
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold leading-tight xl:text-4xl">
          {asideQuote}
        </h2>
        <ul className="mt-6 space-y-2.5 text-sm text-green-100/90">
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8d9c4]" />
            Direct from verified local farms
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8d9c4]" />
            Harvested to order — not weeks in transit
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8d9c4]" />
            Farmers set their own prices
          </li>
        </ul>
      </div>
      <p className="relative z-10 text-xs text-green-200/70">FruitBasket · fresh from farms near you</p>
    </aside>

    <main className="relative flex min-h-0 flex-col overflow-hidden bg-[#f7f3eb]">
      <div className="relative z-10 flex shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3d2f24]/70 hover:text-[#1f6b3a] sm:text-sm"
        >
          <ArrowLeft size={14} /> Back to shop
        </Link>
        <div className="lg:hidden">
          <Logo height={32} />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-4 py-3 sm:px-6 sm:py-4">
        <div className={`mx-auto w-full ${compact ? 'max-w-[520px]' : 'max-w-[400px]'}`}>
          <div className="mb-3 sm:mb-4">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#3d2f24] sm:text-3xl">
              {headline}
            </h1>
            {subhead && (
              <p className="mt-1 text-xs leading-relaxed text-[#6b5e52] sm:text-sm">{subhead}</p>
            )}
          </div>

          <div
            className={`rounded-2xl border border-[#3d2f24]/8 bg-white/95 shadow-[0_16px_40px_-24px_rgba(61,47,36,0.4)] ${
              compact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-5'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default AuthShell;
