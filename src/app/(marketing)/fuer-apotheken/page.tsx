import React from 'react';
import Link from 'next/link';

export default function FuerApothekenPage() {
  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Personalmangel rechtssicher lösen.
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl opacity-90 leading-relaxed">
          Die digitale SaaS-Plattform für Ihr Apotheken-Management. Fokussieren Sie sich auf Ihre Expertise, wir automatisieren die Bürokratie und das Dokumentenmanagement.
        </p>
        <Link 
          href="/onboarding"
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-50 transition-all"
        >
          Plattform betreten
        </Link>
      </section>

      {/* Feature Grid Container */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature Card 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 border border-transparent transition-all duration-300">
            <h2 className="text-slate-900 font-bold text-xl mb-4">Verifizierte Fachkräfte</h2>
            <p className="text-slate-600 leading-relaxed">
              Automatisches Matching von Notdiensten und Vertretungen basierend auf WWS-Expertise und Distanz.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 border border-transparent transition-all duration-300">
            <h2 className="text-slate-900 font-bold text-xl mb-4">AÜG-Compliance & DMS</h2>
            <p className="text-slate-600 leading-relaxed">
              Integrierte AÜG-Prüfung und DSGVO-konformes Dokumentenmanagement-System für Freelancer und Apotheken.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 border border-transparent transition-all duration-300">
            <h2 className="text-slate-900 font-bold text-xl mb-4">pDL Ingestion</h2>
            <p className="text-slate-600 leading-relaxed">
              Einfacher Upload und intelligente Extraktion von pharmazentrischen Dienstleistungen via MiniExcel-Parser.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gray-50 py-20 text-center flex flex-col items-center justify-center border-t border-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
          Bereit für das neue Betriebssystem Ihrer Apotheke?
        </h2>
        <Link 
          href="/onboarding"
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          Jetzt kostenlos registrieren
        </Link>
      </section>
    </div>
  );
}
