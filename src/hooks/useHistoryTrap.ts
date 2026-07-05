'use client';

import { useEffect } from 'react';

export function useHistoryTrap() {
  useEffect(() => {
    // Inject null state to prevent backwards navigation via swipe gestures
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // Force navigation forward to keep the user trapped on this page
      window.history.go(1);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
}
