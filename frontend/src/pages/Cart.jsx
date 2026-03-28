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
    <div className="bg-gray-50 min-h-screen py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-green-600" /> Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">₹{item.price} per {item.unit}</p>
                  <p className="font-bold text-green-600">₹{item.price * item.quantity}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-white rounded hover:shadow-sm text-gray-600 transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-white rounded hover:shadow-sm text-gray-600 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                    Add ₹{500 - subtotal} more to get Free Delivery
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-green-600">₹{total}</span>
                </div>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all">
                Proceed to Checkout
              </button>
              
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
