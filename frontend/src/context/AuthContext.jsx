import React, { createContext, useContext, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const persist = (nextUser, nextToken, refreshToken) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser && nextToken) {
      localStorage.setItem('user', JSON.stringify(nextUser));
      localStorage.setItem('token', nextToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { ok, data } = await api('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (ok) {
        persist(data.user, data.access_token, data.refresh_token);
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.msg || 'Login failed' };
    } catch {
      return { success: false, message: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (authPayload) => {
    persist(authPayload.user, authPayload.access_token, authPayload.refresh_token);
    return {
      success: true,
      user: authPayload.user,
      linked: !!authPayload.linked,
      message: authPayload.msg,
    };
  };

  const register = async (name, email, password, phone, otp = {}) => {
    setLoading(true);
    try {
      const { ok, data } = await api('/api/auth/register', {
        method: 'POST',
        body: { name, email, password, phone, ...otp },
      });
      if (ok) return { success: true };
      return { success: false, message: data?.msg || 'Registration failed' };
    } catch {
      return { success: false, message: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  const registerFarmer = async (payload) => {
    setLoading(true);
    try {
      const { ok, data } = await api('/api/auth/register-farmer', {
        method: 'POST',
        body: payload,
      });
      if (ok) return { success: true, message: data?.msg };
      return { success: false, message: data?.msg || 'Application failed' };
    } catch {
      return { success: false, message: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const { ok, data } = await api('/api/auth/profile', { token });
    if (ok) {
      persist(data, token, localStorage.getItem('refresh_token'));
      return data;
    }
    return null;
  };

  const logout = () => persist(null, null, null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        register,
        registerFarmer,
        refreshProfile,
        logout,
        isAdmin: user?.role === 'admin',
        isFarmer: user?.role === 'farmer',
        farmerApproved: user?.role === 'farmer' && user?.farmer_status === 'approved',
        isNewSeller: !!user?.is_new_seller,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
