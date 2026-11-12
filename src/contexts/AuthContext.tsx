import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  guestLogin: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('salespredict_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('salespredict_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('salespredict_token');
      if (storedToken) {
        try {
          const profile = await api.getProfile();
          setUser(profile.user);
          localStorage.setItem('salespredict_user', JSON.stringify(profile.user));
        } catch {
          // If token expired, setup default demo user
          setupDefaultGuest();
        }
      } else {
        setupDefaultGuest();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const setupDefaultGuest = () => {
    const demoUser: User = {
      id: 'demo-user-1',
      name: 'Dr. Pooja Velmurugan (Lead Analyst)',
      email: 'demo@salespredict.ai',
    };
    setUser(demoUser);
    localStorage.setItem('salespredict_user', JSON.stringify(demoUser));
  };

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('salespredict_token', res.token);
    localStorage.setItem('salespredict_user', JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register({ name, email, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('salespredict_token', res.token);
    localStorage.setItem('salespredict_user', JSON.stringify(res.user));
  };

  const guestLogin = () => {
    setupDefaultGuest();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('salespredict_token');
    localStorage.removeItem('salespredict_user');
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getProfile();
      setUser(res.user);
      localStorage.setItem('salespredict_user', JSON.stringify(res.user));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, guestLogin, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
