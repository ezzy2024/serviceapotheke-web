import React from 'react';
import Link from 'next/link';

export default function FuerApothekenPage() {
  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-50/50 py-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
            Personalmangel<br />
            <span className="text-blue-600">rechtssicher lösen.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Die digitale Plattform für Ihr Apotheken-Management. Fokussieren Sie sich auf Ihre Expertise, wir automatisieren die Bürokratie.
          </p>
          <Link 
            href="/register/pharmacy"
            className="py-4 px-10 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm text-lg"
          >
            Plattform betreten
          </Link>
        </div>
      </section>

      {/* Feature Grid Container */}
      <section className="bg-white py-24 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-slate-900 font-bold text-2xl mb-4 tracking-tight">Verifizierte Fachkräfte</h2>
            <p className="text-slate-600 leading-relaxed">
              Automatisches Matching von Notdiensten und Vertretungen basierend auf WWS-Expertise und Distanz.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-slate-900 font-bold text-2xl mb-4 tracking-tight">Freelancer-Compliance</h2>
            <p className="text-slate-600 leading-relaxed">
              Integrierte Freelancer-Prüfung und DSGVO-konformes Dokumentenmanagement-System.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-slate-900 font-bold text-2xl mb-4 tracking-tight">pDL Ingestion</h2>
            <p className="text-slate-600 leading-relaxed">
              Einfacher Upload und intelligente Extraktion von pharmazentrischen Dienstleistungen via MiniExcel.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-slate-50/50 py-32 text-center flex flex-col items-center justify-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-12 tracking-tight leading-tight">
            Bereit für das Apotheken OS?
          </h2>
          <Link 
            href="/register/pharmacy"
            className="py-4 px-10 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm text-lg"
          >
            Jetzt kostenlos registrieren
          </Link>
        </div>
      </section>
    </div>
  );
}
