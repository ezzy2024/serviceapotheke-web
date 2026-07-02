import Link from 'next/link';
import { Banknote, FileCheck2, Map, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export const metadata = {
  title: 'Für Apotheker | ServiceApotheke - Honorarvertretung für Freelancer',
  description: 'Finden Sie lukrative Schichten als Honorarvertreter. Haversine Matching, automatisierte Rechnungen und garantierter AÜG-Schutz.',
};

export default function ForPharmacists() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-zinc-50 pt-32 pb-24 border-b border-zinc-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 mb-6 tracking-tight">
                  Ihre Expertise. <br className="hidden md:block" />
                  <span className="text-zinc-400">Ihre Bedingungen.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-base md:text-lg text-zinc-500 mb-8 leading-relaxed max-w-xl">
                  Konzentrieren Sie sich auf Ihre pharmazeutische Arbeit. Wir übernehmen die lästige Administration: Verträge, AÜG-Nachweise und die gesamte Rechnungsstellung – vollautomatisiert.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <Link 
                  href="/register/pharmacist" 
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all hover:shadow-md"
                >
                  Als Freelancer starten
                </Link>
              </FadeIn>
            </div>
            
            <div className="hidden md:block relative">
              <FadeIn delay={0.4} direction="left">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200/60 relative w-full max-w-md mx-auto">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 text-sm">Auszahlung initiiert</h3>
                      <p className="text-xs text-zinc-500">Zero-Touch Invoicing erfolgreich</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-zinc-100 rounded-full w-full"></div>
                    <div className="h-2 bg-zinc-100 rounded-full w-3/4"></div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.1}>
            <div className="text-center mb-20">
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Die beste Plattform für Freelancer</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center mb-6">
                  <Map className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Haversine Shift-Radar</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Definieren Sie Ihren Aktionsradius. Unser Algorithmus benachrichtigt Sie nur über lukrative Schichten in Ihrer direkten Umgebung.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center mb-6">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Zero-Touch Invoicing</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Sobald die Apotheke Ihre gearbeiteten Stunden im Dashboard bestätigt, generiert unser System automatisch Ihre Rechnung und sendet sie ab.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Unabhängigkeit Garantiert</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Sie sind Ihr eigener Chef. Das System fragt aktiv Ihren "Independent Contractor" Status ab, um Scheinselbstständigkeit rechtssicher auszuschließen.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-zinc-50 border-t border-zinc-200/60 py-32 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn delay={0.1}>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 mb-6 tracking-tight">Ihre erste Schicht wartet.</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link 
              href="/register/pharmacist" 
              className="inline-flex items-center px-6 py-3 bg-zinc-900 text-white font-semibold rounded-lg shadow-sm hover:bg-zinc-800 transition-colors"
            >
              Jetzt Account erstellen <CheckCircle2 className="w-4 h-4 ml-2" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
