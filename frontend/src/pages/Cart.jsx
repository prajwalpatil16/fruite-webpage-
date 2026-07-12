import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, cartByFarmer } = useCart();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee;
  const groups = cartByFarmer();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-4 py-16 font-sans">
        <div className="mb-5 rounded-full bg-green-100 p-5">
          <ShoppingBag size={48} className="text-green-600" />
        </div>
        <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 sm:text-3xl">Your basket is empty</h2>
        <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-gray-500 sm:text-base">
          Nothing here yet. When you add produce, we&apos;ll keep each farm&apos;s items together —
          so you always know who grew what you&apos;re buying.
        </p>
        <Link
          to="/marketplace"
          className="tap-target inline-flex items-center gap-2 rounded-full bg-green-600 px-8 text-sm font-bold text-white shadow-lg"
        >
          <ArrowLeft size={18} /> Browse the marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-36 font-sans sm:pb-16 sm:py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-extrabold text-gray-900 sm:mb-2 sm:text-3xl">
          <ShoppingBag className="text-green-600" size={26} /> Your basket
        </h1>
        <p className="mb-6 text-sm text-gray-500 sm:mb-8">
          Items from {groups.length} farm{groups.length === 1 ? '' : 's'}. At checkout, each farm packs its own share.
        </p>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-8">
            {groups.map((group) => (
              <section
                key={group.farmer_id || group.farm_name}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="border-b border-green-100 bg-green-50 px-4 py-3 sm:px-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-800">
                    From: {group.farm_name}
                  </p>
                  <p className="mt-0.5 text-xs text-green-700/80">
                    {group.items.length} item{group.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="divide-y divide-gray-50">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-4 sm:items-center sm:gap-5 sm:p-5">
                      <img
                        src={item.image_url || item.image}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200';
                        }}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover bg-gray-50 sm:h-20 sm:w-20"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item.product_id || item.id}`}
                          className="block truncate text-sm font-bold text-gray-900 hover:text-green-700 sm:text-base"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-gray-400">
                          ₹{item.price}/{item.unit || 'unit'}
                        </p>
                        <p className="mt-1 text-sm font-bold text-green-700">
                          ₹{item.price * item.quantity}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-xl border border-gray-100 bg-gray-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product_id || item.id, -1)}
                              className="tap-target flex items-center justify-center text-gray-500 hover:text-green-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product_id || item.id, 1)}
                              className="tap-target flex items-center justify-center text-gray-500 hover:text-green-700"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product_id || item.id)}
                            className="tap-target flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Desktop summary */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Order summary</h2>
              <SummaryLines subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
              <Link
                to="/checkout"
                className="tap-target mt-6 flex w-full items-center justify-center rounded-2xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-600/20"
              >
                Proceed to checkout
              </Link>
              <Link
                to="/marketplace"
                className="mt-3 block text-center text-sm font-bold text-gray-500 hover:text-green-700"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-black text-green-700">₹{total}</p>
          </div>
          <Link
            to="/checkout"
            className="tap-target flex shrink-0 items-center justify-center rounded-2xl bg-green-600 px-6 text-sm font-bold text-white"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

function SummaryLines({ subtotal, deliveryFee, total }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-bold">₹{subtotal}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Delivery</span>
        <span className="font-bold text-green-600">
          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
        </span>
      </div>
      <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
        <span className="font-black">Total</span>
        <span className="font-black text-green-700">₹{total}</span>
      </div>
    </div>
  );
}

export default Cart;
