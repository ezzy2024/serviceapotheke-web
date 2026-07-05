import Link from "next/link";
import { FileCheck, Activity, Users } from "lucide-react";

export default function B2bCarehomeLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Medikations-Sicherheit für Ihr <span className="text-blue-600">Pflegeheim</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              Schützen Sie Ihre Bewohner vor gefährlichen Wechselwirkungen. Erfüllen Sie alle MDK-Prüfrichtlinien mit unseren automatisierten AMTS-Analysen und KI-gestützten Audits.
            </p>
            <div className="mt-10 flex gap-4">
              <a href="#audit-booking" className="rounded-md shadow px-8 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700">
                Audit planen
              </a>
            </div>
          </div>
          {/* Cal.com Embed Placeholder Section / Iframe */}
          <div id="audit-booking" className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 min-h-[600px] flex items-center justify-center">
            <iframe 
              src="https://cal.com/serviceapotheke/audit?embed=1" 
              width="100%" 
              height="600" 
              frameBorder="0" 
              className="rounded-lg"
              title="Audit Booking">
            </iframe>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600 mb-6">
                <FileCheck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">MDK-Konformität</h3>
              <p className="mt-4 text-gray-600">Unsere Berichte sind speziell für die Anforderungen des Medizinischen Dienstes der Krankenversicherung (MDK) konzipiert.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600 mb-6">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">AMTS-Analysen</h3>
              <p className="mt-4 text-gray-600">Vermeiden Sie Polypharmazie und Verschreibungskaskaden mithilfe neuester KI-Analysen und Apotheker-Reviews.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600 mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Resident Safety</h3>
              <p className="mt-4 text-gray-600">Erhöhen Sie die Lebensqualität Ihrer Bewohner durch individuell optimierte und sichere Medikamentenpläne.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
