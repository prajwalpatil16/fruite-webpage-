import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api';

const CartContext = createContext();
const GUEST_KEY = 'fruitbasket_cart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const mergedRef = useRef(false);

  const fetchServerCart = async (authToken) => {
    const { ok, data } = await api('/api/orders/cart', { token: authToken });
    if (ok) setCart(data);
  };

  // Merge guest cart into server cart once per login session
  useEffect(() => {
    if (!token) {
      mergedRef.current = false;
      const localData = localStorage.getItem(GUEST_KEY);
      if (localData) {
        try {
          setCart(JSON.parse(localData));
        } catch {
          setCart([]);
        }
      } else {
        setCart([]);
      }
      return;
    }

    const mergeAndLoad = async () => {
      if (!mergedRef.current) {
        mergedRef.current = true;
        let guestItems = [];
        try {
          guestItems = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
        } catch {
          guestItems = [];
        }
        if (guestItems.length > 0) {
          const payload = guestItems.map((item) => ({
            product_id: item.product_id || item.id,
            quantity: item.quantity || 1,
          }));
          const { ok, data } = await api('/api/orders/cart/merge', {
            method: 'POST',
            token,
            body: { items: payload },
          });
          localStorage.removeItem(GUEST_KEY);
          if (ok) {
            setCart(data);
            return;
          }
        }
      }
      await fetchServerCart(token);
    };

    mergeAndLoad();
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem(GUEST_KEY, JSON.stringify(cart));
    }
  }, [cart, token]);

  const clearCart = () => {
    setCart([]);
    if (!token) localStorage.removeItem(GUEST_KEY);
  };

  const addToCart = async (product) => {
    if (token) {
      await api('/api/orders/cart', {
        method: 'POST',
        token,
        body: { product_id: product.id, quantity: 1 },
      });
      await fetchServerCart(token);
    } else {
      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.id === product.id);
        if (existing) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prevCart,
          {
            ...product,
            id: product.id,
            product_id: product.id,
            quantity: 1,
            image: product.image_url || product.image,
            image_url: product.image_url || product.image,
            farmer: product.farmer || product.farmer_name,
          },
        ];
      });
    }
  };

  const removeFromCart = async (id) => {
    if (token) {
      const itemToRemove = cart.find((item) => item.product_id === id || item.id === id);
      if (!itemToRemove) return;
      await api(`/api/orders/cart/${itemToRemove.id}`, { method: 'DELETE', token });
      setCart((prev) => prev.filter((item) => item.id !== itemToRemove.id));
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id && item.product_id !== id));
    }
  };

  const updateQuantity = async (id, delta) => {
    const itemToUpdate = cart.find((item) => item.product_id === id || item.id === id);
    if (!itemToUpdate) return;
    const newQty = Math.max(1, itemToUpdate.quantity + delta);

    if (token) {
      await api(`/api/orders/cart/${itemToUpdate.id}`, {
        method: 'PUT',
        token,
        body: { quantity: newQty },
      });
      setCart((prev) =>
        prev.map((item) => (item.id === itemToUpdate.id ? { ...item, quantity: newQty } : item))
      );
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id || item.product_id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const cartByFarmer = () => {
    const groups = {};
    for (const item of cart) {
      const key = item.farmer_id || item.farmer || 'Farm';
      const label = item.farmer_name || item.farmer || 'Local farm';
      if (!groups[key]) groups[key] = { farmer_id: item.farmer_id, farm_name: label, items: [] };
      groups[key].items.push(item);
    }
    return Object.values(groups);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        clearCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        getCartTotal,
        cartByFarmer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
