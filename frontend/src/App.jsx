import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Farmers from './pages/Farmers';
import Cooperative from './pages/Cooperative';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Returns from './pages/Returns';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Sell from './pages/Sell';
import FarmerDashboard from './pages/FarmerDashboard';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Help from './pages/Help';
import HelpArticle from './pages/HelpArticle';
import RequireAuth from './components/auth/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Standalone auth — no site navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/farmer/*" element={<FarmerDashboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="cooperative" element={<Cooperative />} />
          <Route path="how-it-works" element={<Cooperative />} />
          <Route path="journal" element={<Blog />} />
          <Route path="journal/:slug" element={<BlogPost />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="help" element={<Help />} />
          <Route path="help/:slug" element={<HelpArticle />} />
          <Route path="sell" element={<Sell />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route
            path="orders"
            element={<RequireAuth><Orders /></RequireAuth>}
          />
          <Route path="returns" element={<Returns />} />
          <Route
            path="profile"
            element={<RequireAuth><Profile /></RequireAuth>}
          />
          <Route path="wishlist" element={<Wishlist />} />
          <Route
            path="checkout"
            element={<RequireAuth><Checkout /></RequireAuth>}
          />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route
            path="admin"
            element={<RequireAuth requireAdmin><Admin /></RequireAuth>}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
