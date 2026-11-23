import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'BUYER' | 'TENANT' | 'OWNER' | 'AGENT';
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  signup: (userData: { name: string; email: string; phone?: string; role?: string; password: string }) => Promise<boolean>;
  logout: () => void;
  getAuthHeader: () => Record<string, string>;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('raylive_token');
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('raylive_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: AbortSignal.timeout(2500)
      });

      if (res.ok) {
        const data = await res.json();
        const authedUser: AuthUser = {
          id: String(data.id || Date.now()),
          name: data.name || (name || email.split('@')[0]),
          email: data.email,
          phone: data.phone || '+91 98765 00000',
          role: data.role || 'BUYER',
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || email)}`
        };

        setToken(data.token);
        setUser(authedUser);
        localStorage.setItem('raylive_token', data.token);
        localStorage.setItem('raylive_user', JSON.stringify(authedUser));
        return true;
      } else if (res.status === 401 || res.status === 400) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Invalid email or password');
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError') && !err.message.includes('timeout')) {
        throw err;
      }
      // Backend offline fallback (demo mode)
    }

    // Graceful offline fallback login
    const displayName = name || email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
    const fallbackUser: AuthUser = {
      id: 'usr_' + Date.now(),
      name: displayName,
      email: email,
      phone: '+91 98765 00000',
      role: email.includes('owner') ? 'OWNER' : email.includes('agent') ? 'AGENT' : 'BUYER',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
    };

    const mockToken = 'mock_jwt_' + Date.now();
    setToken(mockToken);
    setUser(fallbackUser);
    localStorage.setItem('raylive_token', mockToken);
    localStorage.setItem('raylive_user', JSON.stringify(fallbackUser));
    return true;
  };

  const signup = async (userData: { name: string; email: string; phone?: string; role?: string; password: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name.trim(),
          email: userData.email.trim(),
          password: userData.password,
          phone: userData.phone || '',
          role: userData.role || 'BUYER'
        }),
        signal: AbortSignal.timeout(2500)
      });

      if (res.ok) {
        const data = await res.json();
        const authedUser: AuthUser = {
          id: String(data.id || Date.now()),
          name: data.name,
          email: data.email,
          phone: data.phone || userData.phone || '+91 98765 00000',
          role: data.role || (userData.role as any) || 'BUYER',
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`
        };

        setToken(data.token);
        setUser(authedUser);
        localStorage.setItem('raylive_token', data.token);
        localStorage.setItem('raylive_user', JSON.stringify(authedUser));
        return true;
      } else if (res.status === 400) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Registration failed');
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError') && !err.message.includes('timeout')) {
        throw err;
      }
      // Backend offline fallback
    }

    const newUser: AuthUser = {
      id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 98765 00000',
      role: (userData.role as any) || 'BUYER',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`
    };

    const mockToken = 'mock_jwt_' + Date.now();
    setToken(mockToken);
    setUser(newUser);
    localStorage.setItem('raylive_token', mockToken);
    localStorage.setItem('raylive_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('raylive_user');
    localStorage.removeItem('raylive_token');
  };

  const getAuthHeader = (): Record<string, string> => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
