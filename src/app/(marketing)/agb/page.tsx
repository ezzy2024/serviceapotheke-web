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
            <h2>1. Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen der Service Apotheke (B2B- und B2C-Verträge) und ihren Kunden in der jeweils zum Zeitpunkt des Vertragsschlusses gültigen Fassung.
            </p>

            <h2>2. Vertragsschluss</h2>
            <p>
              Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar. Durch Anklicken des Bestellbuttons geben Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.
            </p>

            <h2>3. Preise und Zahlungsbedingungen</h2>
            <p>
              Alle Preise verstehen sich in Euro und beinhalten die gesetzliche Mehrwertsteuer, sofern zutreffend. Die Zahlung erfolgt wahlweise per Vorkasse, Kreditkarte oder Rechnung.
            </p>

            <h2>4. Haftungsausschluss</h2>
            <p>
              Ansprüche des Kunden auf Schadensersatz sind ausgeschlossen. Hiervon ausgenommen sind Schadensersatzansprüche des Kunden aus der Verletzung des Lebens, des Körpers, der Gesundheit oder aus der Verletzung wesentlicher Vertragspflichten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
