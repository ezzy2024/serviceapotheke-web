export default function TelemetryPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Telemetrie & Analytics</h1>
        <p className="text-slate-600">Datenbasierte Einblicke in deinen Schichtbedarf und lokale Markttrends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Durchschnittlicher Stundensatz</h3>
          <p className="text-3xl font-bold text-slate-900">85,00 €</p>
          <p className="text-sm text-emerald-600 mt-2 font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            In deiner Region (50km)
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Vermittlungsquote</h3>
          <p className="text-3xl font-bold text-slate-900">92%</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">aller Vakanzen besetzt</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Verfügbare Apotheker</h3>
          <p className="text-3xl font-bold text-slate-900">14</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">im Umkreis von 50km</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500 py-16">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Erweiterte Analytics demnächst verfügbar</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Wir arbeiten an einem detaillierten Analytics-Dashboard. Hier wirst du bald tiefere Einblicke in Auslastung, historische Daten und regionale Vergleiche finden.
        </p>
      </div>
    </div>
  );
}
