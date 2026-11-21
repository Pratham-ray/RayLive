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
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  signup: (userData: { name: string; email: string; phone?: string; role?: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const login = async (email: string, _password: string, name?: string): Promise<boolean> => {
    // Simulated realistic login (with local persistence)
    const displayName = name || email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
    const loggedInUser: AuthUser = {
      id: 'usr_' + Date.now(),
      name: displayName,
      email: email,
      phone: '+91 98765 00000',
      role: 'BUYER',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
    };

    setUser(loggedInUser);
    localStorage.setItem('raylive_user', JSON.stringify(loggedInUser));
    return true;
  };

  const signup = async (userData: { name: string; email: string; phone?: string; role?: string; password: string }): Promise<boolean> => {
    const newUser: AuthUser = {
      id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 98765 00000',
      role: (userData.role as any) || 'BUYER',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`
    };

    setUser(newUser);
    localStorage.setItem('raylive_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('raylive_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
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
