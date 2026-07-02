export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Einstellungen</h1>
        <p className="text-slate-600">Verwalte die Stammdaten und Präferenzen deiner Apotheke.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500 py-16">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Demnächst verfügbar</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Wir arbeiten an einem umfangreichen Einstellungs-Panel für Apotheken. In der Zwischenzeit wende dich bei Änderungen der Stammdaten bitte an den Support.
        </p>
      </div>
    </div>
  );
}
