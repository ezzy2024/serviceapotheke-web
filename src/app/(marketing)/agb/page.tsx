import React from 'react';

export default function AGBPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
            Rechtliche Rahmenbedingungen
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-lg text-gray-600">Rechtssicherheit und Transparenz für alle Plattform-Teilnehmer.</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-blue prose-lg max-w-none text-gray-600">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Geltungsbereich</h2>
            <p className="mb-4">
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die zwischen der ServiceApotheke (im Folgenden "Anbieter") und ihren Kunden (im Folgenden "Nutzer") über die Nutzung der Plattform geschlossen werden. Die Plattform richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB, juristische Personen des öffentlichen Rechts oder öffentlich-rechtliche Sondervermögen.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Leistungen des Anbieters</h2>
            <p className="mb-4">
              Der Anbieter stellt eine digitale Plattform zur Verfügung, die der Personalvermittlung (Matching von Approbierten, PTA, PKA) sowie der Verwaltung und Dokumentation von Pharmazeutischen Dienstleistungen (pDL) dient. Ein Anspruch auf eine erfolgreiche Vermittlung besteht nicht.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registrierung und Vertragsschluss</h2>
            <p className="mb-4">
              Die Nutzung der Plattform erfordert eine Registrierung. Der Nutzer ist verpflichtet, die bei der Registrierung abgefragten Daten (insb. Approbationsurkunde, Betriebserlaubnis) wahrheitsgemäß und vollständig anzugeben. Der Vertrag kommt mit der Freischaltung des Accounts durch den Anbieter zustande.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pflichten des Nutzers</h2>
            <p className="mb-4">
              Der Nutzer ist verpflichtet, die Zugangsdaten geheim zu halten und vor dem Zugriff Dritter zu schützen. Der Nutzer verpflichtet sich zudem, geltende Gesetze (insbesondere das Arbeitnehmerüberlassungsgesetz - AÜG) eigenverantwortlich einzuhalten.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vergütung und Zahlungsbedingungen</h2>
            <p className="mb-4">
              Die Nutzung der Plattform ist für Arbeitnehmer (Apotheker, PTA, PKA) kostenfrei. Für Apotheken (Arbeitgeber) fallen Vermittlungsgebühren bzw. SaaS-Nutzungsgebühren gemäß der aktuellen Preisliste an. Rechnungen sind innerhalb von 14 Tagen ohne Abzug fällig.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Haftung</h2>
            <p className="mb-4">
              Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Für einfache Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht. In diesem Fall ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Schlussbestimmungen</h2>
            <p className="mb-4">
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Berlin. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt der Vertrag im Übrigen wirksam.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
