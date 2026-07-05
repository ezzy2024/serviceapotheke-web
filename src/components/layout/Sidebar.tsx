'use client';

import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings,
  Radar
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const pharmacyLinks = [
    { name: 'Übersicht', href: '/dashboard/pharmacy', icon: LayoutDashboard },
    { name: 'Vakanzen', href: '/dashboard/pharmacy/jobs', icon: Briefcase },
    { name: 'Rechnungen', href: '/dashboard/pharmacy/invoices', icon: FileText },
    { name: 'pDL Analyzer', href: '/dashboard/pharmacy/pdl', icon: FileText },
    { name: 'aTM Terminals', href: '/dashboard/pharmacy/atm', icon: Radar },
    { name: 'Einstellungen', href: '/dashboard/pharmacy/settings', icon: Settings },
  ];

  const pharmacistLinks = [
    { name: 'Schicht-Radar', href: '/dashboard/pharmacist', icon: Radar },
    { name: 'Meine Schichten', href: '/dashboard/pharmacist/shifts', icon: Briefcase },
    { name: 'Einnahmen', href: '/dashboard/pharmacist/earnings', icon: FileText },
    { name: 'Profil', href: '/dashboard/pharmacist/profile', icon: Settings },
  ];

  const links = user?.role === 'Pharmacy' ? pharmacyLinks : pharmacistLinks;

  if (!user) return null;

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          SA<span className="text-slate-800">.tech</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-700 truncate">{user.role}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
