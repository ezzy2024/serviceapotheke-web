import React from 'react';
import Link from 'next/link';

export default function FuerApothekenPage() {
  return (
    <div className="bg-bone min-h-screen font-sans flex flex-col selection:bg-lime selection:text-ink">
      {/* Hero Section */}
      <section className="bg-ink text-bone py-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center border-b-4 border-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pattern-grid-lg text-bone/5"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-8 font-bricolage uppercase tracking-tighter leading-none">
            Personalmangel<br />
            <span className="text-lime">rechtssicher lösen.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed opacity-90">
            Die digitale Plattform für Ihr Apotheken-Management. Fokussieren Sie sich auf Ihre Expertise, wir automatisieren die Bürokratie.
          </p>
          <Link 
            href="/register/pharmacy"
            className="inline-flex bg-lime text-ink font-bold font-jetbrains uppercase tracking-widest py-4 px-10 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            Plattform betreten
          </Link>
        </div>
      </section>

      {/* Feature Grid Container */}
      <section className="bg-bone py-24 border-b-4 border-ink relative">
        <div className="absolute top-0 left-0 w-full h-full pattern-grid-lg text-ink/5"></div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Feature Card 1 */}
          <div className="bg-white p-8 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <h2 className="text-ink font-black text-2xl mb-4 font-bricolage uppercase tracking-tight">Verifizierte Fachkräfte</h2>
            <p className="text-ink/80 font-medium leading-relaxed">
              Automatisches Matching von Notdiensten und Vertretungen basierend auf WWS-Expertise und Distanz.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-lime p-8 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <h2 className="text-ink font-black text-2xl mb-4 font-bricolage uppercase tracking-tight">Freelancer-Compliance</h2>
            <p className="text-ink/80 font-medium leading-relaxed">
              Integrierte Freelancer-Prüfung und DSGVO-konformes Dokumentenmanagement-System.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white p-8 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <h2 className="text-ink font-black text-2xl mb-4 font-bricolage uppercase tracking-tight">pDL Ingestion</h2>
            <p className="text-ink/80 font-medium leading-relaxed">
              Einfacher Upload und intelligente Extraktion von pharmazentrischen Dienstleistungen via MiniExcel.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-lime py-32 text-center flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pattern-grid-lg text-ink/5"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black text-ink mb-12 font-bricolage uppercase tracking-tighter leading-none">
            Bereit für das Apotheken OS?
          </h2>
          <Link 
            href="/register/pharmacy"
            className="inline-flex bg-white text-ink font-bold font-jetbrains uppercase tracking-widest py-4 px-10 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            Jetzt kostenlos registrieren
          </Link>
        </div>
      </section>
    </div>
  );
}
