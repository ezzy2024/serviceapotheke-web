'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuth } from '@/lib/AuthContext';
import { E2EEProvider } from '@/lib/E2EEContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <div className="w-12 h-12 border-4 border-ink border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Basic protection: if not logged in, AuthContext handles redirect to /login
  // We can just return null here while redirecting
  if (!user) return null;

  return (
    <E2EEProvider>
      <div className="h-screen flex overflow-hidden bg-bone">
        <div className="hidden md:flex flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </E2EEProvider>
  );
}
