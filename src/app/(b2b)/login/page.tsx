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
    <div className="min-h-screen flex items-center justify-center bg-bone relative overflow-hidden font-bricolage p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white border-4 border-ink shadow-[12px_12px_0px_0px_rgba(12,20,16,1)] rounded-none p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-ink tracking-tight uppercase">ServiceApotheke</h1>
            <p className="text-ink/80 font-bold mt-2">Willkommen zurück im Command Center.</p>
          </div>

          <div className="flex bg-bone border-2 border-ink p-1 rounded-none mb-8">
            <button
              onClick={() => setRole('Pharmacist')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-none text-sm font-black uppercase tracking-wide transition-all duration-200 ${role === 'Pharmacist' ? 'bg-ink text-bone shadow-sm' : 'text-ink/70 hover:bg-white hover:text-ink'}`}
            >
              <User className="w-4 h-4 mr-2" />
              Freelancer
            </button>
            <button
              onClick={() => setRole('Pharmacy')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-none text-sm font-black uppercase tracking-wide transition-all duration-200 ${role === 'Pharmacy' ? 'bg-ink text-bone shadow-sm' : 'text-ink/70 hover:bg-white hover:text-ink'}`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Apotheke
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-black uppercase tracking-wide text-ink mb-1">E-Mail</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-none border-2 border-ink bg-white text-ink font-bold focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] transition-all"
                placeholder="name@beispiel.de"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-black uppercase tracking-wide text-ink mb-1">Passwort</label>
              <input 
                id="password"
                name="password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-none border-2 border-ink bg-white text-ink font-bold focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] transition-all tracking-widest"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-sm font-black p-3 bg-red-500 border-2 border-ink shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] uppercase tracking-wide">
                {error}
              </motion.div>
            )}

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm font-black text-ink hover:underline decoration-2 underline-offset-4 uppercase tracking-wide">
                Passwort vergessen?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 border-2 border-ink rounded-none shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] text-sm font-black text-ink uppercase tracking-widest bg-lime hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(12,20,16,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(12,20,16,1)]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Einloggen
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-ink font-bold">
            Noch kein Account? <a href="/register" className="font-black uppercase tracking-wide hover:underline decoration-2 underline-offset-4">Jetzt registrieren</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
