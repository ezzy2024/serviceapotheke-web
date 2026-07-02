'use client';

import { useAuth } from '@/lib/AuthContext';
import { Bell, LogOut, Menu } from 'lucide-react';

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="md:hidden text-slate-500 hover:text-slate-700 mr-4">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 hidden md:block">
          {user?.role === 'Pharmacy' ? 'Apotheken Dashboard' : 'Freelancer Portal'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <button 
          onClick={logout}
          className="flex items-center text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
}
