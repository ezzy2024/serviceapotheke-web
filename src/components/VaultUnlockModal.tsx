'use client';

import React, { useState } from 'react';
import { useE2EE } from '@/lib/E2EEContext';
import { useAuth } from '@/lib/AuthContext';
import { Lock, Loader2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VaultUnlockModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function VaultUnlockModal({ isOpen, onSuccess, onCancel }: VaultUnlockModalProps) {
  const { unlockVault } = useE2EE();
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsUnlocking(true);
    setError('');

    // In a real scenario, you might derive a key and test it against a known hash,
    // but here we just derive the key and assume success if PBKDF2 succeeds.
    // The salt could be the user's ID or email.
    const salt = user?.id || 'default-salt';
    
    // Simulate a slight delay to mimic heavy PBKDF2 calculation if it's too fast
    await new Promise(r => setTimeout(r, 800));

    const success = await unlockVault(password, salt);
    
    setIsUnlocking(false);

    if (success) {
      setPassword('');
      onSuccess();
    } else {
      setError('Kryptographischer Fehler beim Entsperren.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-slate-200/50 p-8 relative border border-slate-100"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Tresor Entsperren
          </h2>
          <p className="text-slate-500 text-center text-sm mb-8">
            Die Gesundheitsdaten sind E2EE verschlüsselt. Bitte geben Sie Ihr Vault-Passwort ein, um den lokalen Schlüssel zu generieren.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vault Passwort</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all font-medium text-slate-900 text-xl tracking-widest text-center"
                required
              />
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-600 font-medium text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  <ShieldAlert className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {onCancel && (
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl transition-all hover:bg-slate-50 hover:shadow-sm"
                >
                  Abbrechen
                </button>
              )}
              <button 
                type="submit" 
                disabled={isUnlocking || !password}
                className="flex-1 py-3.5 bg-blue-600 text-white font-medium rounded-xl transition-all shadow-md hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isUnlocking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entsperren'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
