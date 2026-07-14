export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200/50 rounded-3xl p-10 md:p-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Impressum
          </h1>
          <p className="text-slate-500 font-medium mb-12 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Angaben gemäß § 5 DDG
          </p>
          
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-8 rounded-2xl border border-slate-200/60 mb-12 shadow-sm">
              <h3 className="mt-0 mb-4 text-blue-900">Service Apotheke</h3>
              <p className="my-1 font-medium text-slate-700">Ezzeldin Hassan (Einzelunternehmer)</p>
              <p className="my-1 text-slate-600">Karlsplatz 2</p>
              <p className="my-1 text-slate-600">47798 Krefeld</p>
            </div>

            <h2>Kontakt</h2>
            <p>
              Telefon: +49 (0) 2151 1234567<br />
              E-Mail: <a href="mailto:team@serviceapotheke.tech" className="text-blue-600 hover:text-blue-500 transition-colors">team@serviceapotheke.tech</a>
            </p>

            <h2>Umsatzsteuer-ID</h2>
            <p>
              Kleinunternehmerregelung gemäß § 19 UStG
            </p>

            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Ezzeldin Hassan<br />
              Karlsplatz 2<br />
              47798 Krefeld
            </p>

            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:text-blue-500 transition-colors">
                https://ec.europa.eu/consumers/odr/
              </a>.<br/>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
