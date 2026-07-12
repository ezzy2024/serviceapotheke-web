import React from 'react';
import Link from 'next/link';

export default function KontaktPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="pt-32 pb-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Kontaktieren Sie uns
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Haben Sie Fragen zur Plattform oder benötigen Sie individuelle Beratung? Wir sind für Sie da.
          </p>
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-3xl p-8 border border-gray-100 text-left">
            <form className="flex flex-col gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Max Mustermann" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-Mail Adresse</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="max@apotheke.de" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Nachricht</label>
                <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Wie können wir Ihnen helfen?"></textarea>
              </div>
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all w-full md:w-auto self-end">
                Nachricht senden
              </button>
            </form>
          </div>
          <div className="mt-12">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              &larr; Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
