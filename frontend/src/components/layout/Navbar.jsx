import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ShoppingCart, User, Search, MapPin, ChevronDown,
  Package, Heart, Truck, Sprout, LayoutDashboard, LogOut, Shield,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import UniversalSearch from './UniversalSearch';
import Logo from '../Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout, isFarmer, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const cartCount = getCartCount();

  return (
    <>
      <div className="hidden md:block border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-gray-500 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <Link to="/sell" className="font-medium transition-colors hover:text-green-700">
              Sell on FruitBasket
            </Link>
            <Link to="/cooperative" className="font-medium transition-colors hover:text-green-700">
              How the cooperative works
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden lg:inline-flex items-center gap-1.5">
              <MapPin size={12} /> Fresh from farms near you
            </span>
            <Link to="/help" className="font-medium transition-colors hover:text-green-700">
              Help
            </Link>
            <Link to="/journal" className="font-medium transition-colors hover:text-green-700">
              Journal
            </Link>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center gap-2 sm:h-16 sm:gap-6">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="tap-target flex items-center justify-center rounded-lg text-gray-600 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Logo compact className="mr-1" height={36} />

            <UniversalSearch />

            <div className="ml-auto flex items-center gap-0.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="tap-target flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-50 md:hidden"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              <Link
                to={user ? '/profile' : '/login'}
                className="tap-target flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-50 md:hidden"
                aria-label={user ? 'Account' : 'Sign in'}
              >
                <User size={22} />
              </Link>

              <div className="group relative hidden md:block">
                <button
                  type="button"
                  className="flex h-11 items-center gap-1 rounded-xl px-3 text-left hover:bg-gray-50"
                >
                  <div>
                    <div className="text-[11px] leading-none text-gray-500">
                      {user ? `Hello, ${firstName}` : 'Hello, Sign in'}
                    </div>
                    <div className="mt-1 flex items-center gap-0.5 text-sm font-bold leading-none text-gray-900 group-hover:text-green-700">
                      Account <ChevronDown size={14} />
                    </div>
                  </div>
                </button>
                <div className="invisible absolute right-0 top-full z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  {!user ? (
                    <>
                      <Link to="/login" className="mb-2 block rounded-lg bg-green-600 py-2 text-center text-sm font-bold text-white">
                        Sign In
                      </Link>
                      <p className="mb-2 border-b border-gray-100 pb-2 text-center text-xs text-gray-500">
                        New here?{' '}
                        <Link to="/register" className="font-semibold text-green-700 hover:underline">
                          Create an account
                        </Link>
                      </p>
                    </>
                  ) : (
                    <p className="mb-2 border-b border-gray-100 px-2 pb-2 text-xs text-gray-500">
                      Signed in as <strong className="text-gray-800">{user.email}</strong>
                    </p>
                  )}
                  <ul className="space-y-0.5 text-sm text-gray-700">
                    <li>
                      <Link to="/orders" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-green-50 hover:text-green-700">
                        <Package size={16} /> My Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/returns" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-green-50 hover:text-green-700">
                        <Truck size={16} /> Returns
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-green-50 hover:text-green-700">
                        <User size={16} /> Manage Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/wishlist" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-green-50 hover:text-green-700">
                        <Heart size={16} /> Wishlist
                      </Link>
                    </li>
                    {isFarmer && (
                      <li>
                        <Link to="/farmer" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-green-50 hover:text-green-700">
                          <LayoutDashboard size={16} /> My Farm Dashboard
                        </Link>
                      </li>
                    )}
                    {isAdmin && (
                      <li>
                        <Link to="/admin" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-green-50 hover:text-green-700">
                          <Shield size={16} /> Admin
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/sell" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-green-50 hover:text-green-700">
                        <Sprout size={16} /> Sell on FruitBasket
                      </Link>
                    </li>
                    {user && (
                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-medium hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <Link
                to="/orders"
                className="hidden h-11 flex-col justify-center rounded-xl px-3 hover:bg-gray-50 md:flex"
              >
                <span className="text-[11px] leading-none text-gray-500">Returns</span>
                <span className="mt-1 text-sm font-bold leading-none text-gray-900">& Orders</span>
              </Link>

              <Link
                to="/cart"
                className="tap-target relative flex items-center justify-center gap-2 rounded-xl px-2 hover:bg-gray-50 hover:text-green-700"
                aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
              >
                <span className="relative">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className="hidden text-sm font-bold lg:inline">Cart</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto border-t border-gray-100 py-1 text-sm font-medium text-gray-700 hide-scrollbar sm:gap-2 sm:py-2">
            <Link to="/marketplace" className="tap-target inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2 hover:text-green-700">
              <Menu size={16} /> Shop All
            </Link>
            {[
              ['Fruits', '/marketplace?q=fruit'],
              ['Vegetables', '/marketplace'],
              ['Our Farmers', '/farmers'],
              ['Cooperative', '/cooperative'],
            ].map(([label, to]) => (
              <Link key={label} to={to} className="tap-target inline-flex shrink-0 items-center whitespace-nowrap px-2 hover:text-green-700">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="flex h-full w-4/5 max-w-xs flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-green-600 p-4 text-white">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <User size={22} />
                  {user ? firstName : 'Browse'}
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="tap-target flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto p-3 text-gray-700">
                {[
                  ['/marketplace', 'Marketplace'],
                  ['/farmers', 'Farmers'],
                  ['/journal', 'Journal'],
                  ['/help', 'Help Center'],
                  ['/orders', 'My Orders'],
                  ['/profile', 'Profile'],
                  ['/sell', 'Sell on FruitBasket'],
                ].map(([to, label]) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className="tap-target flex items-center rounded-lg px-3 font-medium hover:bg-green-50"
                  >
                    {label}
                  </Link>
                ))}
                {isFarmer && (
                  <Link to="/farmer" onClick={() => setIsOpen(false)} className="tap-target flex items-center rounded-lg px-3 font-medium text-green-700 hover:bg-green-50">
                    My Farm Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="tap-target flex items-center rounded-lg px-3 font-medium text-green-700 hover:bg-green-50">
                    Admin
                  </Link>
                )}
                {user ? (
                  <button
                    type="button"
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="tap-target flex w-full items-center rounded-lg px-3 text-left font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="tap-target flex items-center rounded-lg px-3 font-medium text-green-700 hover:bg-green-50">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
            <button type="button" className="flex-1 bg-black/50" aria-label="Close menu overlay" onClick={() => setIsOpen(false)} />
          </div>
        )}
      </nav>

      {searchOpen && (
        <UniversalSearch mobileOpen onMobileClose={() => setSearchOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
