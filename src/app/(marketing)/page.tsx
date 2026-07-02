import Link from 'next/link';
import { ShieldCheck, ReceiptText, MapPin, Building, User, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export default function Home() {
  return (
    <div className="bg-zinc-50 relative overflow-hidden min-h-screen">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24 lg:pt-48 lg:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 font-medium text-xs mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
              Die erste vollautomatisierte B2B-Plattform für die Pharmazie
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 tracking-tight mb-8">
              Vertretung finden. <br className="hidden md:block" />
              <span className="text-zinc-400">
                100% AÜG-sicher & Automatisiert.
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Schluss mit manuellen Rechnungen, rechtlichen Grauzonen und ineffektiven Vermittlungsagenturen. ServiceApotheke matcht Angebot und Nachfrage in Echtzeit – rechtsverbindlich und ohne administrativen Overhead.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register/pharmacy" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              >
                <Building className="w-4 h-4 mr-2" />
                Apotheke registrieren
              </Link>
              <Link 
                href="/register/pharmacist" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              >
                <User className="w-4 h-4 mr-2 text-zinc-400" />
                Als Freelancer starten
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-32 border-y border-zinc-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.1} direction="up">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Warum wir den Markt verändern</h2>
              <p className="text-base text-zinc-500 mt-4 max-w-2xl mx-auto">Im Gegensatz zu klassischen Agenturen lösen wir strukturelle Defizite direkt in der Software-Architektur.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-2xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-800 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 tracking-tight">100% AÜG Compliance</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Keine Scheinselbstständigkeit. Unsere State-Machine erzwingt juristisch wasserdichte Bestätigungen ("Independent Contractor Status") bei der Auftragsvergabe und nach der Schicht. Alles dokumentiert und revisionssicher.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white rounded-2xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-800 flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 tracking-tight">Haversine Matching</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Apotheker sehen nur Schichten, die exakt in ihrem vorgegebenen Aktionsradius liegen. Die Distanz wird in Echtzeit über Haversine-Koordinaten berechnet – keine irrelevanten Jobangebote hunderte Kilometer entfernt.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-white rounded-2xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-800 flex items-center justify-center mb-6">
                  <ReceiptText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 tracking-tight">Zero-Touch Invoicing</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Sobald die Apotheke den digitalen Stundenzettel freigibt, generiert unsere Engine im Hintergrund eine DIN-konforme PDF-Rechnung und stellt sie beiden Parteien zur Verfügung. Keine Buchhaltungsfehler mehr.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-zinc-50 py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn delay={0.1}>
            <h2 className="text-3xl font-extrabold text-zinc-900 mb-6 tracking-tight">Bereit für die Zukunft der Honorarvertretung?</h2>
            <p className="text-zinc-500 mb-10 text-base">Der Onboarding-Prozess dauert weniger als 3 Minuten.</p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register/pharmacy" className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm">
                Als Apotheke starten
              </Link>
              <Link href="/register/pharmacist" className="px-8 py-3.5 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-lg font-semibold text-sm transition-colors shadow-sm">
                Als Apotheker beitreten
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
