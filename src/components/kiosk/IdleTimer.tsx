'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function IdleTimer({ timeoutMs = 60000 }: { timeoutMs?: number }) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleIdle = () => {
      // Security Sweep on Timeout
      sessionStorage.clear();
      
      // Optional: Leere hier globale Stores falls vorhanden (z. B. useStore.getState().reset())
      
      // Erzwinge ein hartes Routing ohne Browser-History
      router.replace('/kiosk/start');
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(handleIdle, timeoutMs);
    };

    // Initial timer start
    resetTimer();

    // Event listener for user interaction
    const events = ['touchstart', 'mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router, timeoutMs]);

  // Dies ist eine "unsichtbare" Container-Komponente, die Logik kapselt
  return null;
}
