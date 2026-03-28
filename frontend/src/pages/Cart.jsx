import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex flex-col items-center justify-center font-sans px-4">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <ShoppingBag size={64} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven't added any fresh fruits or vegetables to your cart yet. 
        </p>
        <Link to="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
          <ArrowLeft size={20} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 sm:mb-10 flex items-center gap-3">
          <ShoppingBag className="text-green-600" size={28} /> Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-6 group hover:shadow-md transition-shadow">
                <img 
                  src={item.image} 
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200'}
                  alt={item.name} 
                  className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-50"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400 mb-1">₹{item.price}/{item.unit}</p>
                  <p className="font-bold text-green-600 text-sm sm:text-base">₹{item.price * item.quantity}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 sm:p-2 hover:bg-white rounded-lg hover:shadow-sm text-gray-500 hover:text-green-600 transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 sm:w-10 text-center font-bold text-gray-900 text-sm sm:text-base">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 sm:p-2 hover:bg-white rounded-lg hover:shadow-sm text-gray-500 hover:text-green-600 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all hover:rotate-12"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-4 lg:mt-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-xs text-green-600 bg-green-50/50 border border-green-100 p-3 rounded-xl flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    Add ₹{500 - subtotal} more to get <strong>Free Delivery</strong>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-green-600">₹{total}</span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all text-center">
                Proceed to Checkout
              </Link>
              
              <div className="mt-4 text-center">
                <Link to="/" className="text-green-600 text-sm font-semibold hover:underline">
                  or Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
