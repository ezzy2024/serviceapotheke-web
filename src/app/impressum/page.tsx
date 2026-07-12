export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-900">Impressum</h1>
      <p className="mb-4">Angaben gemäß § 5 DDG:</p>
      
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
        <p className="font-semibold text-lg">Max Mustermann</p>
        <p>Musterstraße 1</p>
        <p>10115 Berlin</p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Kontakt</h2>
      <p>Telefon: +49 (0) 123 44 55 66</p>
      <p>Telefax: +49 (0) 123 44 55 99</p>
      <p>E-Mail: info@serviceapotheke.de</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
      DE999999999</p>
    </div>
  );
}
