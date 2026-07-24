export default function AgbPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200/50 rounded-3xl p-10 md:p-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-slate-500 font-medium mb-12 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Stand: Juli 2026
          </p>
          
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500">
            <h2>§ 1 Geltungsbereich, Vertragspartner</h2>
            <p>
              Diese AGB gelten für die Nutzung der Vermittlungsplattform &quot;ServiceApotheke&quot; (serviceapotheke.tech), betrieben von Ezzeldin Hassan, Karlsplatz 2, 47798 Krefeld. Vertragspartner sind Apotheken (&quot;Auftraggeber&quot;) und approbierte Apotheker:innen (&quot;Auftragnehmer&quot;). Diese AGB gelten ausschließlich gegenüber Unternehmern im Sinne des § 14 BGB.
            </p>

            <h2>§ 2 Leistungsbeschreibung</h2>
            <p>
              ServiceApotheke stellt eine Plattform bereit, über die Auftraggeber Vertretungsschichten ausschreiben und Auftragnehmer sich bewerben können. ServiceApotheke wird nicht Vertragspartei des Vertretungsverhältnisses und tritt weder als Arbeitgeber noch als Apothekenbetreiber auf. Die Basisnutzung (Registrierung, Schichtsuche/-veröffentlichung, Bewerbung, grundlegende Dienstplanfunktionen) ist kostenlos. Kostenpflichtige Zusatzfunktionen sind PDL (Pharmazeutische Dienstleistungen inkl. KI-Medikationsanalyse) und aTM (erweiterte Verwaltungsfunktionen), nach Freischaltung durch ServiceApotheke kostenpflichtig.
            </p>

            <h2>§ 3 Registrierung und Verifizierung</h2>
            <p>
              Auftragnehmer weisen im Rahmen der Registrierung ihre berufliche Qualifikation (Approbation) nach. ServiceApotheke führt eine Plausibilitätsprüfung durch, übernimmt aber keine Garantie für Vollständigkeit/Richtigkeit; die Verantwortung für die Eignungsprüfung im Einzelfall verbleibt beim Auftraggeber.
            </p>

            <h2>§ 4 Zustandekommen und Durchführung von Vertretungsverhältnissen</h2>
            <p>
              Mit Annahme einer Bewerbung kommt ein Vertretungsverhältnis unmittelbar zwischen Auftraggeber und Auftragnehmer zustande. ServiceApotheke vermittelt den Kontakt und stellt die technische Infrastruktur bereit. Überschneidende Zeiträume mehrerer angenommener Schichten werden systemseitig unterbunden.
            </p>

            <h2>§ 5 Vergütung und Zahlungsabwicklung</h2>
            <p>
              Die Vergütung wird zwischen Auftraggeber und Auftragnehmer vereinbart; ServiceApotheke stellt auf Basis bestätigter Arbeitszeiten die Rechnungsunterlagen bereit. Sämtliche Zahlungen (Vergütung der Auftragnehmer und Entgelte für Zusatzfunktionen) erfolgen ausschließlich auf Rechnung per Banküberweisung; eine Online-Zahlungsabwicklung findet nicht statt. Rechnungen sind, sofern nicht anders vereinbart, innerhalb von 14 Tagen fällig.
            </p>

            <h2>§ 6 KI-gestützte Funktionen</h2>
            <p>
              Die im Rahmen von PDL und Chatbot erzeugten KI-Analysen (u. a. zu Medikamenteninteraktionen) stellen keine pharmazeutische, medizinische oder rechtliche Beratung dar. Die nutzende Apotheke ist verpflichtet, KI-Ergebnisse eigenverantwortlich fachlich zu prüfen. ServiceApotheke haftet nicht für die inhaltliche Richtigkeit KI-generierter Analysen.
            </p>

            <h2>§ 7 Pflichten der Nutzer</h2>
            <p>
              Nutzer verpflichten sich zu wahrheitsgemäßen Angaben, vertraulicher Behandlung ihrer Zugangsdaten und Unterlassung missbräuchlicher Nutzung.
            </p>

            <h2>§ 8 Haftung</h2>
            <p>
              Unbeschränkte Haftung für Vorsatz, grobe Fahrlässigkeit und nach dem Produkthaftungsgesetz. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten Beschränkung auf den vorhersehbaren, vertragstypischen Schaden; im Übrigen Haftungsausschluss für leichte Fahrlässigkeit. Keine Haftung für die ordnungsgemäße Erbringung der Vertretungstätigkeit durch den Auftragnehmer.
            </p>

            <h2>§ 9 Laufzeit und Kündigung</h2>
            <p>
              Das Nutzungsverhältnis läuft auf unbestimmte Zeit, kündbar von beiden Seiten mit 14 Tagen Frist zum Monatsende, soweit für Zusatzfunktionen nichts anderes vereinbart ist. Außerordentliche Kündigung aus wichtigem Grund bleibt unberührt.
            </p>

            <h2>§ 10 Änderung dieser AGB</h2>
            <p>
              ServiceApotheke kann diese AGB mit Wirkung für die Zukunft ändern. Registrierte Nutzer werden in Textform informiert; widerspricht der Nutzer nicht innerhalb von vier Wochen, gelten die geänderten AGB als angenommen, worauf in der Änderungsmitteilung gesondert hingewiesen wird.
            </p>

            <h2>§ 11 Schlussbestimmungen</h2>
            <p>
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist, soweit gesetzlich zulässig, Krefeld. Salvatorische Klausel: Die Unwirksamkeit einzelner Bestimmungen lässt die übrigen unberührt.<br />
              Stand: Juli 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
