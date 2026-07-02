import Link from 'next/link';
import { ShieldCheck, UserCheck, Settings, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Für Apotheken | ServiceApotheke - AÜG sichere Honorarvertretung',
  description: 'Lösen Sie Ihren Personalmangel rechtssicher. Automatisierte AÜG-Compliance, geprüfte PTA/Apotheker Notdienste und Zero-Touch Invoicing.',
};

export default function ForPharmacies() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-50 py-20 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
                Maximale Ausfallsicherheit. <br/>
                <span className="text-indigo-600">Ohne rechtliche Risiken.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Klassische Vermittlungsagenturen ignorieren oft die juristischen Stolpersteine der Scheinselbstständigkeit. ServiceApotheke schützt Sie mit einer knallharten, automatisierten Compliance-Engine.
              </p>
              <Link 
                href="/register/pharmacy" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-all"
              >
                Kostenloses Apotheken-Konto erstellen
              </Link>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-indigo-200 blur-[80px] opacity-40 rounded-full"></div>
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">AÜG-Checkpoint bestanden</h3>
                    <p className="text-sm text-slate-500">Rechtsverbindliche Honorarvertretung</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-100 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-2 bg-slate-100 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points vs Solutions */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Die Lösung für strukturelle Defizite</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Verifizierte Fachkräfte</h3>
              <p className="text-slate-600">Jeder Apotheker wird von uns durch den Upload der Approbationsurkunde verifiziert. Kein Blindflug mehr bei der Personalauswahl.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Hardcoded Compliance</h3>
              <p className="text-slate-600">Das Arbeitnehmerüberlassungsgesetz (AÜG) ist streng. Unser System erzwingt die juristischen Bestätigungen vor jeder Schichtvergabe. Sie sind auf der sicheren Seite.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Automatisierte Administration</h3>
              <p className="text-slate-600">Vergessen Sie Excel-Tabellen und manuelle Rechnungsprüfung. Sobald die Schicht absolviert ist, übernimmt unsere Engine das Zero-Touch Invoicing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-indigo-600 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6">Inserieren Sie Ihre erste Vakanz in unter 3 Minuten.</h2>
        <Link 
          href="/register/pharmacy" 
          className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-colors"
        >
          Jetzt registrieren <CheckCircle2 className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
