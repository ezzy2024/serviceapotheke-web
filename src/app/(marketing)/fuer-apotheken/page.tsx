import Link from 'next/link';
import { ShieldCheck, UserCheck, Settings, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export const metadata = {
  title: 'Für Apotheken | ServiceApotheke - AÜG sichere Honorarvertretung',
  description: 'Lösen Sie Ihren Personalmangel rechtssicher. Automatisierte AÜG-Compliance, geprüfte PTA/Apotheker Notdienste und Zero-Touch Invoicing.',
};

export default function ForPharmacies() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-zinc-50 pt-32 pb-24 border-b border-zinc-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 mb-6 tracking-tight">
                  Maximale Ausfallsicherheit. <br className="hidden md:block" />
                  <span className="text-zinc-400">Ohne rechtliche Risiken.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-base md:text-lg text-zinc-500 mb-8 leading-relaxed max-w-xl">
                  Klassische Vermittlungsagenturen ignorieren oft die juristischen Stolpersteine der Scheinselbstständigkeit. ServiceApotheke schützt Sie mit einer strikten, automatisierten Compliance-Engine.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <Link 
                  href="/register/pharmacy" 
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all hover:shadow-md"
                >
                  Kostenloses Apotheken-Konto erstellen
                </Link>
              </FadeIn>
            </div>
            
            <div className="hidden md:block relative">
              <FadeIn delay={0.4} direction="left">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200/60 relative w-full max-w-md mx-auto">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 text-sm">AÜG-Checkpoint bestanden</h3>
                      <p className="text-xs text-zinc-500">Rechtsverbindliche Honorarvertretung</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-zinc-100 rounded-full w-full"></div>
                    <div className="h-2 bg-zinc-100 rounded-full w-5/6"></div>
                    <div className="h-2 bg-zinc-100 rounded-full w-4/6"></div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points vs Solutions */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.1}>
            <div className="text-center mb-20">
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Die Lösung für strukturelle Defizite</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center mb-6">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Verifizierte Fachkräfte</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Jeder Apotheker wird von uns durch den Upload der Approbationsurkunde verifiziert. Kein Blindflug mehr bei der Personalauswahl.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Hardcoded Compliance</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Das AÜG ist streng. Unser System erzwingt die juristischen Bestätigungen vor jeder Schichtvergabe. Sie sind auf der sicheren Seite.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-lg flex items-center justify-center mb-6">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Automatisierte Administration</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Vergessen Sie Excel-Tabellen und Rechnungsprüfung. Sobald die Schicht absolviert ist, übernimmt unsere Engine das Zero-Touch Invoicing.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-zinc-50 border-t border-zinc-200/60 py-32 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn delay={0.1}>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 mb-6 tracking-tight">Inserieren Sie Ihre erste Vakanz in unter 3 Minuten.</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link 
              href="/register/pharmacy" 
              className="inline-flex items-center px-6 py-3 bg-zinc-900 text-white font-semibold rounded-lg shadow-sm hover:bg-zinc-800 transition-colors"
            >
              Jetzt registrieren <CheckCircle2 className="w-4 h-4 ml-2" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
