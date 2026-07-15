import MarketingNavbar from '@/components/layout/MarketingNavbar';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">S</div>
              <span className="text-lg font-bold text-white tracking-tight">ServiceApotheke</span>
            </div>
            <p className="text-sm max-w-sm">
              Wir digitalisieren die Apotheken-Infrastruktur. Sicher, effizient und zukunftsweisend.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/fuer-apotheken" className="hover:text-white transition-colors">Für Apotheken</Link></li>
              <li><Link href="/fuer-apotheker" className="hover:text-white transition-colors">Für Apotheker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} ServiceApotheke – Ezzeldin Hassan (Einzelunternehmer). Alle Rechte vorbehalten.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="w-5 h-5 bg-gray-700 rounded-full hover:bg-gray-500 transition-colors cursor-pointer"></div>
            <div className="w-5 h-5 bg-gray-700 rounded-full hover:bg-gray-500 transition-colors cursor-pointer"></div>
          </div>
        </div>
      </footer>
    </>
  );
}
