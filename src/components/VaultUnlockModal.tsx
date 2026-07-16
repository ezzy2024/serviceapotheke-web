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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-bone border-4 border-ink shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white border-4 border-ink flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Lock className="w-8 h-8 text-ink" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-ink uppercase tracking-tight text-center mb-2">
            Tresor Entsperren
          </h2>
          <p className="text-ink/80 font-bold text-center text-sm mb-8">
            Die Gesundheitsdaten sind E2EE verschlüsselt. Bitte geben Sie Ihr Vault-Passwort ein, um den lokalen Schlüssel zu generieren.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-ink uppercase tracking-wide mb-2">Vault Passwort</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-none bg-white border-4 border-ink focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-ink text-xl tracking-widest text-center"
                required
              />
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-600 font-bold text-sm bg-red-100 p-3 border-2 border-red-600">
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
                  className="flex-1 py-4 bg-white border-4 border-ink text-ink font-black uppercase tracking-wide transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                >
                  Abbrechen
                </button>
              )}
              <button 
                type="submit" 
                disabled={isUnlocking || !password}
                className="flex-1 py-4 bg-blue-600 border-4 border-ink text-white font-black uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3"
              >
                {isUnlocking ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Entsperren'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
