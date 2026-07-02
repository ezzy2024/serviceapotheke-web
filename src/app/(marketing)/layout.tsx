import MarketingNavbar from '@/components/layout/MarketingNavbar';
import { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} ServiceApotheke.tech. Alle Rechte vorbehalten. 
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Impressum</a>
            <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-white transition-colors">AGB</a>
          </div>
        </div>
      </footer>
    </>
  );
}
