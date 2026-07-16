import React from 'react';
import Link from 'next/link';

export default function UeberUnsPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans flex flex-col">
      <main className="pt-32 pb-32 relative overflow-hidden flex-1">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-6">
            Mission
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
            Über ServiceApotheke
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-16 leading-relaxed">
            Wir digitalisieren die Apotheken-Infrastruktur.<br/>
            <span className="text-slate-500">Sicher, effizient und zukunftsweisend.</span>
          </p>
          
          <div className="bg-white p-8 md:p-12 text-left rounded-2xl shadow-sm border border-slate-200/50 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight">Das Apotheken OS</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              ServiceApotheke ist das neue Betriebssystem für Ihre Apotheke. Wir bieten Automatisierung für Vertretungsdienste, pDL-Abrechnungen und Dokumentenmanagement in einer zentralen Plattform.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Unser Ziel ist es, den Verwaltungsaufwand für Apotheker zu minimieren und eine nahtlose, rechtssichere Infrastruktur zu schaffen. So können Sie sich auf das Wesentliche konzentrieren: die Beratung und bestmögliche Versorgung Ihrer Patienten.
            </p>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link 
              href="/register" 
              className="py-4 px-10 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm text-lg"
            >
              Jetzt starten
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
