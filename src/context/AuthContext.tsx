'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  hollandCode?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  login: (userData: User, token: string) => void;
  register: (userData: User, token: string) => void;
  logout: () => void;
  syncQuizData: (hollandCode: string) => void;
  getSyncData: () => { holland: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage and verify token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('careerDNA_user');
      const savedToken = localStorage.getItem('authToken');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Optionally verify token by calling /api/auth/me
          setUser(parsedUser);
          setToken(savedToken);
          setIsLoggedIn(true);
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } catch (e) {
          console.error('Failed to parse user data:', e);
          localStorage.removeItem('careerDNA_user');
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(true);
    localStorage.setItem('careerDNA_user', JSON.stringify(userData));
    localStorage.setItem('authToken', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const register = (userData: User, authToken: string) => {
    // Same as login for registration
    login(userData, authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('careerDNA_user');
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Sync quiz data between modules
  const syncQuizData = (hollandCode: string) => {
    const syncData = { holland: hollandCode };
    localStorage.setItem('careerDNA_sync', JSON.stringify(syncData));
  };

  const getSyncData = () => {
    const syncRaw = localStorage.getItem('careerDNA_sync');
    if (syncRaw) {
      try {
        return JSON.parse(syncRaw);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        token,
        login,
        register,
        logout,
        syncQuizData,
        getSyncData,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
