import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, ReceiptText, MapPin, Building, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-slate-50 relative overflow-hidden">
      {/* Background blobs for Glassmorphism feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
            Die erste vollautomatisierte B2B-Plattform für die Pharmazie
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            Vertretung finden. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
              100% AÜG-sicher & Automatisiert.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Schluss mit manuellen Rechnungen, rechtlichen Grauzonen und ineffektiven Vermittlungsagenturen. ServiceApotheke matcht Angebot und Nachfrage in Echtzeit – rechtsverbindlich und ohne administrativen Overhead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register/pharmacy" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center"
            >
              <Building className="w-5 h-5 mr-2" />
              Apotheke registrieren
            </Link>
            <Link 
              href="/register/pharmacist" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Als Freelancer starten
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 border-y border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Warum wir den Markt verändern</h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">Im Gegensatz zu klassischen Agenturen (wie "Flying Pharmacist") lösen wir strukturelle Defizite direkt in der Software-Architektur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% AÜG Compliance</h3>
              <p className="text-slate-600 leading-relaxed">
                Keine Scheinselbstständigkeit. Unsere State-Machine erzwingt juristisch wasserdichte Bestätigungen ("Independent Contractor Status") bei der Auftragsvergabe und nach der Schicht. Alles dokumentiert und revisionssicher.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Geospatial Haversine Matching</h3>
              <p className="text-slate-600 leading-relaxed">
                Apotheker sehen nur Schichten, die exakt in ihrem vorgegebenen Aktionsradius liegen. Die Distanz wird in Echtzeit über Haversine-Koordinaten berechnet – keine irrelevanten Jobangebote hunderte Kilometer entfernt.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <ReceiptText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Zero-Touch Invoicing</h3>
              <p className="text-slate-600 leading-relaxed">
                Sobald die Apotheke den digitalen Stundenzettel freigibt, generiert unsere Engine im Hintergrund eine DIN-konforme PDF-Rechnung und stellt sie beiden Parteien zur Verfügung. Keine Buchhaltungsfehler mehr.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">Bereit für die Zukunft der Honorarvertretung?</h2>
          <p className="text-slate-400 mb-10 text-lg">Egal ob du Personal suchst oder als freier Apotheker durchstarten willst. Der Prozess dauert weniger als 3 Minuten.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register/pharmacy" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors">
              Als Apotheke starten
            </Link>
            <Link href="/register/pharmacist" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold transition-colors">
              Als Apotheker beitreten
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
