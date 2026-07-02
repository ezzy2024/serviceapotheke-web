import Link from 'next/link';
import { MapPin, Euro, Receipt, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Für Apotheker | ServiceApotheke - Honorarvertretung ohne Bürokratie',
  description: 'Finde lukrative Schichten in deiner Nähe. Garantierter Mindestlohn, automatische Fahrtkostenerstattung und Zero-Touch Invoicing für Freelance Apotheker.',
};

export default function ForPharmacists() {
  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
            Konzentriere dich auf die Pharmazie. <br/>
            <span className="text-indigo-600">Wir machen die Administration.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Als Vertretungsapotheker willst du Apotheken helfen und gutes Geld verdienen – nicht stundenlang Rechnungen tippen. ServiceApotheke automatisiert deinen gesamten Workflow.
          </p>
          <Link 
            href="/register/pharmacist" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-slate-900 hover:bg-indigo-600 shadow-xl transition-all"
          >
            Kostenlos als Freelancer starten
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Euro className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-slate-900">Garantiert faire Konditionen</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    Unsere Plattform erzwingt ein hartes Limit: Keine Schicht wird unter 45€/h ausgeschrieben. Zudem ist eine automatische Fahrtkostenerstattung (0,30€/km) tief in der Architektur verankert.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-slate-900">Schicht-Radar mit Haversine-Matching</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    Lege deinen Einsatzradius fest. Unser Backend berechnet in Echtzeit via Haversine-Algorithmus exakt die Vakanzen, die für dich logistisch Sinn machen. Frictionless One-Click Application.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Receipt className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-slate-900">Zero-Touch Invoicing</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    Nach der Schicht klickst du auf "Abschließen". Das System generiert automatisch eine rechtskonforme Rechnung und stellt sie der Apotheke zu. Keine Word-Vorlagen, kein Buchhaltungs-Chaos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Dein Onboarding</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</span>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-800">Account anlegen</h4>
                    <p className="text-sm text-slate-500">Persönliche Daten & Radius definieren</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</span>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-800">Approbation hochladen</h4>
                    <p className="text-sm text-slate-500">Sicherer Upload für die B2B-Verifizierung</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">3</span>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-800">Schichten finden</h4>
                    <p className="text-sm text-slate-500">Direkt loslegen und erstes Geld verdienen</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-10">
                <Link href="/register/pharmacist" className="flex items-center text-indigo-600 font-bold hover:text-indigo-700">
                  Zum Registrierungs-Wizard <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
