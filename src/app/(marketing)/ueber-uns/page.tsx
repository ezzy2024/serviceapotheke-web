import React from 'react';
import Link from 'next/link';

export default function UeberUnsPage() {
  return (
    <div className="bg-bone min-h-screen font-sans flex flex-col selection:bg-lime selection:text-ink">
      <main className="pt-32 pb-32 border-b-4 border-ink relative overflow-hidden flex-1">
        <div className="absolute top-0 left-0 w-full h-full pattern-grid-lg text-ink/5"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-lime text-ink font-bold font-jetbrains uppercase tracking-widest py-2 px-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-10">
            Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-ink mb-10 tracking-tighter uppercase font-bricolage leading-none">
            Über ServiceApotheke
          </h1>
          <p className="text-2xl md:text-3xl text-ink font-medium mb-16 leading-tight">
            Wir digitalisieren die Apotheken-Infrastruktur.<br/>
            <span className="text-ink/60">Sicher, effizient und zukunftsweisend.</span>
          </p>
          
          <div className="bg-white p-8 md:p-12 text-left border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-16">
            <h2 className="text-3xl font-black text-ink mb-6 font-bricolage uppercase tracking-tight">Das Apotheken OS</h2>
            <p className="text-lg text-ink/80 mb-6 font-medium leading-relaxed">
              ServiceApotheke ist das neue Betriebssystem für Ihre Apotheke. Wir bieten Automatisierung für Vertretungsdienste, pDL-Abrechnungen und Dokumentenmanagement in einer zentralen Plattform.
            </p>
            <p className="text-lg text-ink/80 font-medium leading-relaxed">
              Unser Ziel ist es, den Verwaltungsaufwand für Apotheker zu minimieren und eine nahtlose, rechtssichere Infrastruktur zu schaffen. So können Sie sich auf das Wesentliche konzentrieren: die Beratung und bestmögliche Versorgung Ihrer Patienten.
            </p>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link 
              href="/register" 
              className="inline-flex bg-ink text-bone font-bold font-jetbrains uppercase tracking-widest py-4 px-10 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
            >
              Jetzt starten
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
