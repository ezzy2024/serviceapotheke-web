import React from 'react';
import Link from 'next/link';

export default function UeberUnsPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="pt-32 pb-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Über ServiceApotheke
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Wir digitalisieren die Apotheken-Infrastruktur. Sicher, effizient und zukunftsweisend.
          </p>
          <div className="prose prose-lg mx-auto text-left text-gray-700">
            <p>
              ServiceApotheke ist das neue Betriebssystem für Ihre Apotheke. Wir bieten Automatisierung für Vertretungsdienste, pDL-Abrechnungen und Dokumentenmanagement.
            </p>
            <p>
              Unser Ziel ist es, den Verwaltungsaufwand für Apotheker zu minimieren und eine nahtlose, rechtssichere Infrastruktur zu schaffen, damit Sie sich auf das Wesentliche konzentrieren können: die Beratung und Versorgung Ihrer Patienten.
            </p>
          </div>
          <div className="mt-12">
            <Link 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
