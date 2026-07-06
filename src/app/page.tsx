import React from 'react';
import Link from 'next/link';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function ModernLandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-xl font-bold tracking-tight">ServiceApotheke</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#loesungen" className="hover:text-blue-600 transition-colors">Lösungen</a>
            <a href="#vorteile" className="hover:text-blue-600 transition-colors">Vorteile</a>
            <a href="#ueber-uns" className="hover:text-blue-600 transition-colors">Über uns</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/onboarding" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-600/20">
              Jetzt starten
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-24 pb-32">
          <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              Das neue Betriebssystem für Ihre Apotheke
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
              Apotheken-Management,<br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">neu gedacht.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Automatisieren Sie Vertretungsdienste, pDL-Abrechnungen und Dokumentenmanagement mit unserer nahtlosen Zero-Instruction Plattform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/onboarding" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl hover:shadow-blue-600/20 flex items-center justify-center gap-2">
                Kostenlos registrieren
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a href="#mehr-erfahren" className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                Mehr erfahren
              </a>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="loesungen" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Rechtssichere Prozesse</h3>
                <p className="text-gray-600">Integrierte AÜG-Prüfung und DSGVO-konformes Dokumentenmanagement für Freelancer und Apotheken.</p>
              </div>
              
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Smarte Vermittlung</h3>
                <p className="text-gray-600">Automatisches Matching von Notdiensten und Vertretungen basierend auf WWS-Expertise und Distanz.</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-purple-100 hover:bg-purple-50/50 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">pDL Automatisierung</h3>
                <p className="text-gray-600">Einfacher Upload und intelligente Extraktion von pharmazentrischen Dienstleistungen (MiniExcel).</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
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
              <li><Link href="/ueber-uns" className="hover:text-white transition-colors">Über uns</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
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
          <p>&copy; {new Date().getFullYear()} ServiceApotheke GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social Icons Placeholder */}
            <div className="w-5 h-5 bg-gray-700 rounded-full hover:bg-gray-500 transition-colors cursor-pointer"></div>
            <div className="w-5 h-5 bg-gray-700 rounded-full hover:bg-gray-500 transition-colors cursor-pointer"></div>
          </div>
        </div>
      </footer>

      {/* Legal Cookie Consent */}
      <CookieConsent />
    </div>
  );
}
