'use client';

import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings,
  Radar,
  Calendar
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const pharmacyLinks = [
    { name: 'Übersicht', href: '/dashboard/pharmacy', icon: LayoutDashboard },
    { name: 'Vakanzen', href: '/dashboard/pharmacy/jobs', icon: Briefcase },
    { name: 'Dienstplan', href: '/dashboard/pharmacy/dienstplan', icon: Calendar },
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
      <div className="p-6 border-b border-slate-200 bg-white flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
          S
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          ServiceApotheke
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
              className={`flex items-center px-4 py-3 font-medium text-sm transition-all duration-200 group rounded-xl ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.role}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
