'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Building2, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

export default function LoginPage() {
  const [role, setRole] = useState<'Pharmacy' | 'Pharmacist'>('Pharmacist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Login] handleLogin started', { email, role });
    setError('');
    setIsLoading(true);
    
    const endpoint = role === 'Pharmacy' ? '/Pharmacy/login' : '/Pharmacist/login';
    
    try {
      console.log('[Login] calling api.post', endpoint);
      // The HttpOnly cookie is set automatically by the backend
      const res = await api.post(endpoint, { email, password });
      console.log('[Login] api.post succeeded', res.data);
      
      // Notify Context
      login({ id: res.data.id, email, role });
      console.log('[Login] login context updated');
    } catch (err: any) {
      console.error('[Login] api.post failed', err.message, err.response?.status);
      setError(err.response?.data?.message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ServiceApotheke</h1>
            <p className="text-slate-500 font-medium mt-2">Willkommen zurück im Command Center.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setRole('Pharmacist')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'Pharmacist' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <User className="w-4 h-4 mr-2" />
              Freelancer
            </button>
            <button
              onClick={() => setRole('Pharmacy')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'Pharmacy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Apotheke
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">E-Mail</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="name@beispiel.de"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Passwort</label>
              <input 
                id="password"
                name="password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-xl border border-red-100">
                {error}
              </motion.div>
            )}

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline decoration-slate-300 underline-offset-4 transition-colors">
                Passwort vergessen?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 bg-blue-600 text-white rounded-xl shadow-sm text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Einloggen
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500 font-medium">
            Noch kein Account? <a href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline decoration-blue-200 underline-offset-4 transition-colors">Jetzt registrieren</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
