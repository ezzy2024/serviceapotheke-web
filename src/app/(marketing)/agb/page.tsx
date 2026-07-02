import React from 'react';

export default function AGBPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
          
          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die zwischen der ServiceApotheke GmbH (im Folgenden "Anbieter") und ihren Kunden (im Folgenden "Nutzer") über die Nutzung der Plattform geschlossen werden. Die Plattform richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB, juristische Personen des öffentlichen Rechts oder öffentlich-rechtliche Sondervermögen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Leistungen des Anbieters</h2>
              <p>
                Der Anbieter stellt eine digitale Plattform zur Verfügung, die der Personalvermittlung (Matching von Approbierten, PTA, PKA) sowie der Verwaltung und Dokumentation von Pharmazeutischen Dienstleistungen (pDL) dient. Ein Anspruch auf eine erfolgreiche Vermittlung besteht nicht.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Registrierung und Vertragsschluss</h2>
              <p>
                Die Nutzung der Plattform erfordert eine Registrierung. Der Nutzer ist verpflichtet, die bei der Registrierung abgefragten Daten (insb. Approbationsurkunde, Betriebserlaubnis) wahrheitsgemäß und vollständig anzugeben. Der Vertrag kommt mit der Freischaltung des Accounts durch den Anbieter zustande.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Pflichten des Nutzers</h2>
              <p>
                Der Nutzer ist verpflichtet, die Zugangsdaten geheim zu halten und vor dem Zugriff Dritter zu schützen. Der Nutzer verpflichtet sich zudem, geltende Gesetze (insbesondere das Arbeitnehmerüberlassungsgesetz - AÜG) eigenverantwortlich einzuhalten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Vergütung und Zahlungsbedingungen</h2>
              <p>
                Die Nutzung der Plattform ist für Arbeitnehmer (Apotheker, PTA, PKA) kostenfrei. Für Apotheken (Arbeitgeber) fallen Vermittlungsgebühren bzw. SaaS-Nutzungsgebühren gemäß der aktuellen Preisliste an. Rechnungen sind innerhalb von 14 Tagen ohne Abzug fällig.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Haftung</h2>
              <p>
                Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Für einfache Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht. In diesem Fall ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Schlussbestimmungen</h2>
              <p>
                Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Berlin. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt der Vertrag im Übrigen wirksam.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
