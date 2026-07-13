'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { deriveKey } from './crypto';

interface E2EEContextType {
  encryptionKey: CryptoKey | null;
  unlockVault: (password: string, salt: string) => Promise<boolean>;
  lockVault: () => void;
  isUnlocked: boolean;
}

const E2EEContext = createContext<E2EEContextType>({
  encryptionKey: null,
  unlockVault: async () => false,
  lockVault: () => {},
  isUnlocked: false,
});

export function E2EEProvider({ children }: { children: ReactNode }) {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  const unlockVault = async (password: string, salt: string) => {
    try {
      const key = await deriveKey(password, salt);
      setEncryptionKey(key);
      return true;
    } catch (err) {
      console.error('Failed to unlock vault', err);
      return false;
    }
  };

  const lockVault = () => {
    setEncryptionKey(null);
  };

  return (
    <E2EEContext.Provider value={{
      encryptionKey,
      unlockVault,
      lockVault,
      isUnlocked: encryptionKey !== null,
    }}>
      {children}
    </E2EEContext.Provider>
  );
}

export const useE2EE = () => useContext(E2EEContext);
