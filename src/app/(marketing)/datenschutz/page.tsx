export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200/50 rounded-3xl p-10 md:p-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Datenschutzerklärung
          </h1>
          <p className="text-slate-500 font-medium mb-12 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Stand: Juli 2026
          </p>
          
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900">
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
              Ezzeldin Hassan, Service Apotheke (Einzelunternehmer), Karlsplatz 2, 47798 Krefeld<br />
              E-Mail: <a href="mailto:team@serviceapotheke.tech" className="text-blue-600 hover:text-blue-500">team@serviceapotheke.tech</a>, Telefon: +49 151 66884447
            </p>

            <h2>2. Datenschutzbeauftragter</h2>
            <p>
              Derzeit ist kein Datenschutzbeauftragter bestellt. Angesichts der Verarbeitung besonderer Kategorien personenbezogener Daten (Gesundheitsdaten im Rahmen der KI-gestützten Medikationsanalyse, siehe Ziffer 7) empfehlen wir dringend, diesen Punkt mit einem Fachanwalt für Datenschutzrecht zu klären, da sich hieraus nach § 38 BDSG i. V. m. Art. 37 DSGVO eine Pflicht zur Bestellung ergeben kann, unabhängig von der Mitarbeiterzahl.
            </p>

            <h2>3. Allgemeines zur Datenverarbeitung</h2>
            <p>
              ServiceApotheke ist eine Vermittlungsplattform, die Apotheken mit approbierten Apotheker:innen für die Übernahme von Vertretungsdiensten (Schichten) zusammenbringt. Zur Erbringung dieser Vermittlungsleistung sowie ausgewählter kostenpflichtiger Zusatzfunktionen verarbeiten wir personenbezogene Daten unserer Nutzer:innen.
            </p>

            <h2>4. Ihre Rechte</h2>
            <p>
              Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21), Widerruf erteilter Einwilligungen (Art. 7 Abs. 3), Beschwerde bei einer Aufsichtsbehörde (Art. 77).<br />
              Zuständige Aufsichtsbehörde: Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW), Kavalleriestraße 2–4, 40213 Düsseldorf.
            </p>

            <h2>5. Welche Daten wir verarbeiten</h2>
            <h3>5.1 Apotheken</h3>
            <p>
              Stammdaten (Name, Anschrift, Kontaktdaten), Betriebserlaubnis/Apothekenbetriebserlaubnis, Umsatzsteuer-ID, hochgeladene Dokumente, Nutzungs- und Zugriffsdaten, UTM-/Kampagnendaten zur Nachverfolgung der Registrierungsquelle.
            </p>

            <h3>5.2 Apotheker:innen (Vertretungspersonal)</h3>
            <p>
              Stammdaten, berufsbezogene Daten (Approbation, Berufserfahrung, WWS-Kenntnisse), Finanzdaten (IBAN, BIC, Steuer-ID), hochgeladene Nachweisdokumente, Profilbild, Geräte- und Standortdaten (Push-Token, Standortdaten zur Schichtsuche).
            </p>

            <h3>5.3 Verbraucher:innen</h3>
            <p>
              Stammdaten sowie ggf. Zeitpunkt eines erklärten Verzichts auf das gesetzliche Widerrufsrecht (§ 356 Abs. 4 BGB).
            </p>

            <h2>6. Zwecke und Rechtsgrundlagen</h2>
            <p>
              Vertragsabwicklung: Art. 6 Abs. 1 lit. b DSGVO. Gesetzliche Pflichten (Rechnungsstellung, steuerliche Aufbewahrung, KYC): Art. 6 Abs. 1 lit. c. Berechtigtes Interesse (Betrugsprävention, Plattformsicherheit, Reichweitenmessung): Art. 6 Abs. 1 lit. f. Freiwillige Zusatzfunktionen mit Einwilligung (Standortdienste, Marketing, KI-Medikationsanalyse): Art. 6 Abs. 1 lit. a, für Gesundheitsdaten zusätzlich Art. 9 Abs. 2 lit. a.
            </p>

            <h2>7. Besondere Kategorien personenbezogener Daten – KI-gestützte Funktionen (PDL/AMTS, Chatbot)</h2>
            <p>
              Im Rahmen der kostenpflichtigen Zusatzleistung &quot;Pharmazeutische Dienstleistungen&quot; (PDL) sowie des Chatbots bieten wir eine KI-gestützte Analyse zur erweiterten Medikationsberatung bei Polymedikation (AMTS) an. Hierbei werden von der Apotheke eingegebene Medikationsdaten von Patient:innen – dies können Gesundheitsdaten im Sinne des Art. 9 DSGVO sein – zur Analyse an den KI-Dienst Google Gemini (Google Ireland Limited bzw. Google LLC) übermittelt. Die Nutzung dieser Funktion setzt eine gesonderte, ausdrückliche Einwilligung nach Art. 9 Abs. 2 lit. a DSGVO voraus. Die von der KI generierten Analysen ersetzen keine pharmazeutische oder ärztliche Beurteilung und sind entsprechend gekennzeichnet.
            </p>

            <h2>8. Empfänger / Auftragsverarbeiter</h2>
            <p>
              Google Cloud Platform (Cloud Run, Cloud SQL, Cloud Storage) – Hosting, EU-Serverstandort (europe-west1/europe-west3). Google Firebase Cloud Messaging – Push-Benachrichtigungen. Google Gemini API – KI-Medikationsanalyse und Chatbot. IONOS SE – System- und Transaktions-E-Mails.
            </p>

            <h2>9. Datenübermittlung in Drittländer</h2>
            <p>
              Da einzelne Dienstleister (Google) ihren Hauptsitz in den USA haben, kann es im Einzelfall zu einer Übermittlung in ein Drittland kommen, auf Grundlage von EU-Standardvertragsklauseln und/oder dem EU-U.S. Data Privacy Framework.
            </p>

            <h2>10. Speicherdauer</h2>
            <p>
              Rechnungen/steuerrelevante Unterlagen: 10 Jahre (§ 147 AO, § 257 HGB). Nachweisdokumente: für die Dauer des Kontos, danach Anonymisierung. Protokoll-/Sitzungs-/Token-Daten: kurzfristig, i. d. R. unter 30 Tage.
            </p>

            <h2>11. Cookies und Tracking</h2>
            <p>
              Wir setzen technisch notwendige Cookies zur Bereitstellung der Plattform ein. Darüberhinausgehende Cookies/Tracking nur mit vorheriger Einwilligung über ein Cookie-Consent-Banner.
            </p>

            <h2>12. Änderungen dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung an geänderte Rechtslagen oder Änderungen des Dienstes anzupassen.<br />
              Stand: Juli 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
