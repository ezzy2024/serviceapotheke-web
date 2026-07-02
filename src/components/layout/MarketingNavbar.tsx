'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function MarketingNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
              SA<span className="text-slate-800">.tech</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/fuer-apotheken" 
              className={`text-sm font-semibold transition-colors ${pathname === '/fuer-apotheken' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Für Apotheken
            </Link>
            <Link 
              href="/fuer-apotheker" 
              className={`text-sm font-semibold transition-colors ${pathname === '/fuer-apotheker' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Für Apotheker
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-colors shadow-md hover:shadow-lg"
            >
              Kostenlos registrieren
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-slate-600 hover:text-slate-900">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
