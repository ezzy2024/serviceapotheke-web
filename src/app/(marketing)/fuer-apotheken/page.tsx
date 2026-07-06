import Link from 'next/link';
import { ShieldCheck, UserCheck, Settings, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export const metadata = {
  title: 'Für Apotheken | ServiceApotheke - AÜG sichere Honorarvertretung',
  description: 'Lösen Sie Ihren Personalmangel rechtssicher. Automatisierte AÜG-Compliance, geprüfte PTA/Apotheker Notdienste und Zero-Touch Invoicing.',
};

export default function ForPharmacies() {
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
                  Personalmangel rechtssicher lösen
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                  Maximale Ausfallsicherheit. <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Ohne rechtliche Risiken.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                  Klassische Vermittlungsagenturen ignorieren oft die juristischen Stolpersteine der Scheinselbstständigkeit. ServiceApotheke schützt Sie mit einer strikten, automatisierten Compliance-Engine.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register/pharmacy" 
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                  >
                    Kostenloses Apotheken-Konto erstellen
                  </Link>
                </div>
              </FadeIn>
            </div>
            
            <div className="hidden md:block relative">
              <FadeIn delay={0.5} direction="left">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 relative w-full max-w-md mx-auto hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">AÜG-Checkpoint bestanden</h3>
                      <p className="text-sm text-gray-500">Rechtsverbindliche Honorarvertretung</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
                    <div className="h-3 bg-emerald-100 rounded-full w-4/6"></div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.1}>
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Die Lösung für strukturelle Defizite</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">Verabschieden Sie sich von Verwaltungsaufwand und Unsicherheit.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Verifizierte Fachkräfte</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">Jeder Apotheker wird von uns durch den Upload der Approbationsurkunde verifiziert. Kein Blindflug mehr bei der Personalauswahl.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hardcoded Compliance</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">Das AÜG ist streng. Unser System erzwingt die juristischen Bestätigungen vor jeder Schichtvergabe. Sie sind stets auf der sicheren Seite.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Automatisierte Administration</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">Vergessen Sie Excel-Tabellen und Rechnungsprüfung. Sobald die Schicht absolviert ist, übernimmt unsere Engine das Zero-Touch Invoicing.</p>
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
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Inserieren Sie Ihre erste Vakanz in unter 3 Minuten.</h2>
            <p className="text-blue-100 text-lg mb-10">Die Registrierung ist kostenlos und ohne monatliche Fixkosten.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link 
              href="/register/pharmacy" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold rounded-full shadow-xl hover:bg-gray-50 hover:scale-105 transition-all"
            >
              Konto erstellen <CheckCircle2 className="w-5 h-5 ml-2 text-emerald-500" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
