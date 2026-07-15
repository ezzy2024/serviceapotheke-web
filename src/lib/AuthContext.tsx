'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from './api';

interface User {
  id: string;
  email: string;
  role: 'Pharmacy' | 'Pharmacist';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/Auth/me');
      setUser(res.data);
      
      // If user tries to access /login or /register while authenticated, redirect to dashboard
      if (pathname === '/login' || pathname === '/register') {
        redirectBasedOnRole(res.data.role);
      }
    } catch (error: any) {
      console.error('[AuthContext] /Auth/me Ping Failed:', error.response?.status, error.message);
      setUser(null);
      // If we are on a protected route, api interceptor handles redirect
      // but we can also be explicit here
      if (pathname.startsWith('/dashboard')) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    setTimeout(() => {
      if (role === 'Pharmacy') {
        router.push('/dashboard/pharmacy');
      } else {
        router.push('/dashboard/pharmacist');
      }
    }, 50);
  };

  const login = (userData: User) => {
    sessionStorage.removeItem('sa_history_trap_id');
    setUser(userData);
    redirectBasedOnRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
