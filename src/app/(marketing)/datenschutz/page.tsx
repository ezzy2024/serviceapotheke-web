import React from 'react';

export default function DatenschutzPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
            Datenschutz & Sicherheit
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Datenschutzerklärung</h1>
          <p className="text-lg text-gray-600">Ihre Daten sind bei uns sicher. Transparenz und DSGVO-Konformität stehen an erster Stelle.</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-blue prose-lg max-w-none text-gray-600">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Datenschutz auf einen Blick</h2>
            <p className="font-semibold text-gray-900 mb-2">Allgemeine Hinweise</p>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Verantwortliche Stelle</h2>
            <p className="mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              <strong>ServiceApotheke</strong><br />
              Karlsplatz 2<br />
              47798 Krefeld<br />
              E-Mail: ezzeldinemad90@gmail.com / team@serviceapotheke.tech
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Datenerfassung auf dieser Website</h2>
            <p className="font-semibold text-gray-900 mb-2">Registrierung und Matching</p>
            <p className="mb-4">
              Wenn Sie sich als Apotheke oder pharmazeutisches Personal auf unserer Plattform registrieren, erheben wir Bestandsdaten (z.B. Name, E-Mail, Qualifikationen, Approbationsurkunde) zur Vertragserfüllung und Vermittlung (Art. 6 Abs. 1 lit. b DSGVO). Diese Daten werden sicher verarbeitet und nicht ohne Ihre ausdrückliche Zustimmung an unbeteiligte Dritte weitergegeben.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Server-Log-Dateien</h2>
            <p className="mb-4">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners und Uhrzeit der Serveranfrage.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Ihre Rechte</h2>
            <p className="mb-4">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
