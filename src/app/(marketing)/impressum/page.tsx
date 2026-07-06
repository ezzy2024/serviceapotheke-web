import React from 'react';

export default function ImpressumPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
            Rechtliche Anbieterkennung
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Impressum</h1>
          <p className="text-lg text-gray-600">Angaben gemäß § 5 TMG.</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-blue prose-lg max-w-none text-gray-600">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="mb-4">
              Ezzeldin Hassan (Einzelunternehmen)<br />
              Karlsplatz 2<br />
              47798 Krefeld<br />
              Deutschland
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
            <p className="mb-4">
              E-Mail: ezzeldinemad90@gmail.com<br />
              E-Mail: team@serviceapotheke.tech
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="mb-4">
              Ezzeldin Hassan<br />
              Karlsplatz 2<br />
              47798 Krefeld<br />
              Deutschland
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
