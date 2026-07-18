import Link from 'next/link';
import { ArrowRight, Pill, User, Building2 } from 'lucide-react';

export default function CentralRegistrationGateway() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-24 font-sans">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight text-center">
          Registrierung
        </h1>
        <p className="text-slate-600 text-center mb-12 font-medium">
          Wählen Sie Ihren Bereich, um zu starten.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Pharmacy Card */}
          <Link href="/register/pharmacy" className="group block">
            <div className="bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col h-full rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0 opacity-0 group-hover:opacity-100"></div>
              
              <Building2 className="w-12 h-12 text-blue-600 mb-6 relative z-10" strokeWidth={2} />
              
              <h2 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">Für Apotheken</h2>
              <p className="text-slate-600 mb-8 flex-grow relative z-10">
                Finden Sie qualifizierte Vertretungen, verwalten Sie pDL-Einsätze und buchen Sie aTM-Termine.
              </p>
              
              <div className="inline-flex items-center text-blue-600 font-semibold text-sm transition-colors relative z-10">
                Apotheke Registrieren <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Pharmacist Card */}
          <Link href="/register/pharmacist" className="group block">
            <div className="bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col h-full rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0 opacity-0 group-hover:opacity-100"></div>
              
              <User className="w-12 h-12 text-blue-600 mb-6 relative z-10" strokeWidth={2} />
              
              <h2 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">Für Apotheker</h2>
              <p className="text-slate-600 mb-8 flex-grow relative z-10">
                Bieten Sie Ihre Dienste als Vertretung an, verwalten Sie Schichten und maximieren Sie Ihren Umsatz.
              </p>
              
              <div className="inline-flex items-center text-blue-600 font-semibold text-sm transition-colors relative z-10">
                Apotheker Registrieren <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
