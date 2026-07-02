import Link from 'next/link';
import { Building2, User, ArrowRight } from 'lucide-react';

export default function RegisterHub() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-4xl z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Werde Teil von ServiceApotheke</h1>
          <p className="text-xl text-slate-500 mt-4 max-w-2xl mx-auto">Die moderne Plattform für Freelance Apotheker und smarte Apotheken. Wie möchtest du dich registrieren?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pharmacist Card */}
          <Link href="/register/pharmacist" className="group block h-full">
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-10 h-full hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Für Apotheker (Freelancer)</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Finde flexible Vertretungsschichten in deiner Nähe. Lade deine Approbationsurkunde hoch, lege deinen Stundenlohn fest und bewirb dich mit einem Klick.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                Jetzt Profil erstellen <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Pharmacy Card */}
          <Link href="/register/pharmacy" className="group block h-full">
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-10 h-full hover:shadow-2xl hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Für Apotheken (B2B)</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Inseriere Vakanzen und finde verifizierte Vertretungsapotheker. Profitiere von automatisierter Rechnungsstellung und Echtzeit-Hardware-Telemetrie.
              </p>
              <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                Apotheke registrieren <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-500">
            Bereits registriert? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Zum Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
