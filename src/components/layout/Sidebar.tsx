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
    <div className="w-64 bg-bone border-r-2 border-ink h-full flex flex-col">
      <div className="p-6 border-b-2 border-ink bg-white flex items-center space-x-2">
        <div className="w-8 h-8 bg-ink text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_0px_rgba(12,20,16,1)]">
          S
        </div>
        <h1 className="text-xl font-black text-ink tracking-tight">
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
              className={`flex items-center px-4 py-3 font-bold uppercase tracking-wide text-sm transition-all duration-200 group border-2 border-transparent ${
                isActive 
                  ? 'bg-ink text-bone shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-ink' 
                  : 'text-ink hover:bg-white hover:border-ink hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-bone' : 'text-ink'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-ink bg-white">
        <div className="flex items-center p-3 bg-bone border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-bone font-black mr-3">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-ink uppercase truncate">{user.role}</p>
            <p className="text-xs text-ink/70 font-semibold truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
