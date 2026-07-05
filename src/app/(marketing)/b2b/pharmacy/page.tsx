import Link from "next/link";
import { CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";

export default function B2bPharmacyLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              Zero-Touch Invoicing & <span className="text-blue-600">pDL-Umsatz</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Die erste AÜG-konforme Plattform für temporäre Apothekenvertretung. Komplett automatisierte Abrechnung. Zusätzliche Erlöse durch pharmazeutische Dienstleistungen (pDL).
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/register/pharmacy" className="rounded-md shadow px-8 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700">
                Jetzt Apotheke registrieren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600 mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">AÜG-Compliance</h3>
              <p className="mt-4 text-gray-600">Kein Schein-Selbstständigkeits-Risiko. Vollständig gesicherte Arbeitnehmerüberlassung nach aktuellen rechtlichen Standards.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600 mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Zero-Touch Invoicing</h3>
              <p className="mt-4 text-gray-600">Zwei-Rechnungs-Modell (Dual-Invoice). Sie erhalten direkt die geprüften PDFs, keine manuellen Buchungsschritte nötig.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600 mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">pDL-Umsatz</h3>
              <p className="mt-4 text-gray-600">Erschließen Sie neue Einnahmequellen durch automatisierte Auswertungen von Medikationsanalysen (AMTS) mithilfe unserer KI.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
