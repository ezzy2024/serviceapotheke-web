export default function PharmacyDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Apotheken Administrator</h2>
        <p className="text-slate-500">Willkommen in deinem Dashboard. Hier verwaltest du Vakanzen und Stundenzettel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 bg-blue-50/30">
          <h3 className="font-semibold text-blue-900">Offene Schichten</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 bg-green-50/30">
          <h3 className="font-semibold text-green-900">Ausstehende Freigaben</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 bg-purple-50/30">
          <h3 className="font-semibold text-purple-900">Gesamtausgaben</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">€4,250</p>
        </div>
      </div>
    </div>
  );
}
