import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [cart, setCart] = useState([]);

  // Fetch cart from backend if logged in
  useEffect(() => {
    if (token) {
      const fetchCart = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/orders/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setCart(data);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };
      fetchCart();
    } else {
      // Load from local storage if not logged in
      const localData = localStorage.getItem('fruitbasket_cart');
      if (localData) setCart(JSON.parse(localData));
    }
  }, [token]);

  // Sync with local storage if not logged in
  useEffect(() => {
    if (!token) {
      localStorage.setItem('fruitbasket_cart', JSON.stringify(cart));
    }
  }, [cart, token]);

  const addToCart = async (product) => {
    if (token) {
      try {
        await fetch('http://localhost:5000/api/orders/cart', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: product.id, quantity: 1 })
        });
        // Refetch or optimistic update
        const response = await fetch('http://localhost:5000/api/orders/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      setCart((prevCart) => {
        const existing = prevCart.find(item => item.id === product.id);
        if (existing) {
          return prevCart.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (id) => {
    if (token) {
      try {
        // Find the database cart item id if needed, or use product_id
        // In my API, manage_cart takes item_id. 
        // Let's assume we use the item_id from the cart list.
        const itemToRemove = cart.find(item => item.product_id === id || item.id === id);
        if (!itemToRemove) return;

        await fetch(`http://localhost:5000/api/orders/cart/${itemToRemove.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCart((prevCart) => prevCart.filter(item => item.id !== itemToRemove.id));
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      setCart((prevCart) => prevCart.filter(item => item.id !== id));
    }
  };

  const updateQuantity = async (id, delta) => {
    const itemToUpdate = cart.find(item => item.product_id === id || item.id === id);
    if (!itemToUpdate) return;
    const newQty = Math.max(1, itemToUpdate.quantity + delta);

    if (token) {
      try {
        await fetch(`http://localhost:5000/api/orders/cart/${itemToUpdate.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: newQty })
        });
        setCart((prevCart) => prevCart.map(item => 
          item.id === itemToUpdate.id ? { ...item, quantity: newQty } : item
        ));
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      setCart((prevCart) => prevCart.map(item => {
        if (item.id === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      }));
    }
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
