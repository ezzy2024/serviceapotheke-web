import Link from 'next/link';
import { Banknote, FileCheck2, Map, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export const metadata = {
  title: 'Für Apotheker | ServiceApotheke - Honorarvertretung für Freelancer',
  description: 'Finden Sie lukrative Schichten als Honorarvertreter. Haversine Matching, automatisierte Rechnungen und garantierter AÜG-Schutz.',
};

export default function ForPharmacists() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-32 pb-24 border-b border-gray-100">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                  Honorarvertretung ohne Bürokratie
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                  Ihre Expertise. <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Ihre Bedingungen.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                  Konzentrieren Sie sich auf Ihre pharmazeutische Arbeit. Wir übernehmen die lästige Administration: Verträge, AÜG-Nachweise und die gesamte Rechnungsstellung – vollautomatisiert.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register/pharmacist" 
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                  >
                    Als Freelancer starten
                  </Link>
                </div>
              </FadeIn>
            </div>
            
            <div className="hidden md:block relative">
              <FadeIn delay={0.5} direction="left">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 relative w-full max-w-md mx-auto hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Auszahlung initiiert</h3>
                      <p className="text-sm text-gray-500">Zero-Touch Invoicing erfolgreich</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-3 bg-emerald-100 rounded-full w-3/4"></div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.1}>
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Die beste Plattform für Freelancer</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">Entwickelt für maximale Unabhängigkeit und Effizienz.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Haversine Shift-Radar</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">Definieren Sie Ihren Aktionsradius. Unser Algorithmus benachrichtigt Sie exklusiv über lukrative Schichten in Ihrer direkten Umgebung.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Zero-Touch Invoicing</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">Sobald die Apotheke Ihre gearbeiteten Stunden im Dashboard bestätigt, generiert unser System automatisch Ihre Rechnung und sendet sie ab.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Unabhängigkeit Garantiert</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">Sie sind Ihr eigener Chef. Das System fragt aktiv Ihren Status als freier Mitarbeiter ab, um Scheinselbstständigkeit rechtssicher auszuschließen.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ihre erste Schicht wartet.</h2>
            <p className="text-blue-100 text-lg mb-10">Treten Sie dem modernsten Netzwerk für pharmazeutische Fachkräfte bei.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link 
              href="/register/pharmacist" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold rounded-full shadow-xl hover:bg-gray-50 hover:scale-105 transition-all"
            >
              Account erstellen <CheckCircle2 className="w-5 h-5 ml-2 text-emerald-500" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
