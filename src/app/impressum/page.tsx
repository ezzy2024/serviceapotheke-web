export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-900">Impressum</h1>
      <p className="mb-4">Angaben gemäß § 5 DDG:</p>
      
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
        <p className="font-semibold text-lg">Service Apotheke</p>
        <p>Ezzeldin Hassan (Einzelunternehmer)</p>
        <p>Karlsplatz 2</p>
        <p>47798 Krefeld</p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Kontakt</h2>
      <p>E-Mail: team@serviceapotheke.tech</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Umsatzsteuer-ID</h2>
      <p>Nicht umsatzsteuerpflichtig.</p>
    </div>
  );
}
