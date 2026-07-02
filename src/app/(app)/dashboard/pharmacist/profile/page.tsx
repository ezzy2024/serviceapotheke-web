export default function ProfilePage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Mein Profil</h1>
        <p className="text-slate-600">Verwalte deine persönlichen Daten, Qualifikationen und Einstellungen.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-100">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
            PH
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Apotheker Profil</h2>
            <p className="text-slate-500">Approbierter Apotheker</p>
          </div>
        </div>

        <div className="space-y-6 text-center text-slate-500 py-8">
          <p>Profildaten können derzeit noch nicht direkt im Dashboard bearbeitet werden.</p>
          <p>Bitte kontaktiere unseren Support, um Änderungen an deinen Approbationsdaten vorzunehmen.</p>
        </div>
      </div>
    </div>
  );
}
