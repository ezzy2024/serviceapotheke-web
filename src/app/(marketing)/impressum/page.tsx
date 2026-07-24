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
            <h2>Angaben gemäß § 5 DDG</h2>
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-8 rounded-2xl border border-slate-200/60 mb-12 shadow-sm">
              <h3 className="mt-0 mb-4 text-blue-900">Service Apotheke</h3>
              <p className="my-1 font-medium text-slate-700">Ezzeldin Hassan (Einzelunternehmer)</p>
              <p className="my-1 text-slate-600">Karlsplatz 2</p>
              <p className="my-1 text-slate-600">47798 Krefeld</p>
              <p className="my-1 text-slate-600">Deutschland</p>
            </div>

            <h2>Kontakt</h2>
            <p>
              Telefon: +49 151 66884447<br />
              E-Mail: <a href="mailto:team@serviceapotheke.tech" className="text-blue-600 hover:text-blue-500 transition-colors">team@serviceapotheke.tech</a>
            </p>

            <h2>Umsatzsteuer</h2>
            <p>
              Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer ausgewiesen.
            </p>

            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              Ezzeldin Hassan<br />
              Karlsplatz 2<br />
              47798 Krefeld
            </p>

            <h2>Streitschlichtung</h2>
            <p>
              Die Europäische Kommission hat ihre Plattform zur Online-Streitbeilegung (OS-Plattform) zum 20. Juli 2025 eingestellt; ein Verweis auf diese Plattform ist daher nicht mehr zutreffend.
            </p>
            <p>
              Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle im Sinne des Verbraucherstreitbeilegungsgesetzes (VSBG) teilzunehmen.
            </p>

            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>

            <h2>Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>

            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
