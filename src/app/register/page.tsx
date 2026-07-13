import Link from 'next/link';
import { ArrowRight, Pill, User, Building2 } from 'lucide-react';

export default function CentralRegistrationGateway() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center p-6 pt-24 font-sans">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-5xl font-black text-ink mb-2 font-bricolage tracking-tight text-center uppercase">
          Registrierung
        </h1>
        <p className="text-ink/70 text-center mb-12 font-medium">
          Wählen Sie Ihren Bereich, um zu starten.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pharmacy Card */}
          <Link href="/register/pharmacy" className="group block">
            <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(12,20,16,1)] hover:shadow-[12px_12px_0px_0px_rgba(12,20,16,1)] hover:-translate-y-1 transition-all duration-200 p-8 flex flex-col h-full rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0 opacity-20 group-hover:opacity-100"></div>
              
              <Building2 className="w-12 h-12 text-ink mb-6 relative z-10" strokeWidth={2} />
              
              <h2 className="text-2xl font-bold text-ink mb-3 font-bricolage relative z-10">Für Apotheken</h2>
              <p className="text-ink/80 mb-8 flex-grow font-medium relative z-10">
                Finden Sie qualifizierte Vertretungen, verwalten Sie pDL-Einsätze und buchen Sie aTM-Termine.
              </p>
              
              <div className="inline-flex items-center text-ink font-bold font-jetbrains text-sm uppercase tracking-wide group-hover:text-lime-600 transition-colors relative z-10">
                Apotheke Registrieren <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Pharmacist Card */}
          <Link href="/register/pharmacist" className="group block">
            <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(12,20,16,1)] hover:shadow-[12px_12px_0px_0px_rgba(12,20,16,1)] hover:-translate-y-1 transition-all duration-200 p-8 flex flex-col h-full rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0 opacity-20 group-hover:opacity-100"></div>
              
              <User className="w-12 h-12 text-ink mb-6 relative z-10" strokeWidth={2} />
              
              <h2 className="text-2xl font-bold text-ink mb-3 font-bricolage relative z-10">Für Apotheker</h2>
              <p className="text-ink/80 mb-8 flex-grow font-medium relative z-10">
                Bieten Sie Ihre Dienste als Vertretung an, verwalten Sie Schichten und maximieren Sie Ihren Umsatz.
              </p>
              
              <div className="inline-flex items-center text-ink font-bold font-jetbrains text-sm uppercase tracking-wide group-hover:text-lime-600 transition-colors relative z-10">
                Apotheker Registrieren <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Patient Card */}
          <Link href="/register/patient" className="group block">
            <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(12,20,16,1)] hover:shadow-[12px_12px_0px_0px_rgba(12,20,16,1)] hover:-translate-y-1 transition-all duration-200 p-8 flex flex-col h-full rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-persimmon rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0 opacity-10 group-hover:opacity-20"></div>
              
              <Pill className="w-12 h-12 text-ink mb-6 relative z-10" strokeWidth={2} />
              
              <h2 className="text-2xl font-bold text-ink mb-3 font-bricolage relative z-10">Für Patienten</h2>
              <p className="text-ink/80 mb-8 flex-grow font-medium relative z-10">
                Verwalten Sie Ihre Rezepte, buchen Sie Termine vor Ort und bestellen Sie Medikamente.
              </p>
              
              <div className="inline-flex items-center text-ink font-bold font-jetbrains text-sm uppercase tracking-wide group-hover:text-persimmon transition-colors relative z-10">
                Kunde Registrieren <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
