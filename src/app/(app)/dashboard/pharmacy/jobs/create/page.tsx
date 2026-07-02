'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Calendar, Clock, Euro, MapPin, Building, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function CreateJobPost() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salary, setSalary] = useState<number>(45); // Default to minimum
  const [requiredSoftware, setRequiredSoftware] = useState('Pharmatechnik IXOS');
  
  // Travel Expenses
  const [travelExpenseCap, setTravelExpenseCap] = useState<number | ''>('');
  
  // Accommodation
  const [accommodationType, setAccommodationType] = useState('');
  
  // Validation State
  const [daysDifference, setDaysDifference] = useState(0);

  // Recalculate days difference when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysDifference(diffDays);
      
      if (diffDays < 3) {
        setAccommodationType(''); // Reset if condition not met
      }
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-flight Validations
    if (new Date(startDate) >= new Date(endDate)) {
      setError('Das Enddatum muss nach dem Startdatum liegen.');
      return;
    }

    if (salary < 45) {
      setError('Der plattformweite Mindestlohn beträgt 45€/h. Bitte anpassen.');
      return;
    }

    if (daysDifference >= 3 && !accommodationType) {
      setError('Für Schichten ab 3 Tagen ist eine Unterkunftsregelung zwingend erforderlich.');
      return;
    }

    setIsLoading(true);
    try {
      // DTO mapping for backend
      await api.post('/Job', {
        title,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        salary,
        requiredSoftware,
        isUrgent: false,
        
        // Serialize additional metadata into the notes/description field or dedicated columns if they exist
        // Note: In MVP we'll push this into Description. In a real schema, we'd add columns.
        description: JSON.stringify({
          travelExpenseCap: travelExpenseCap,
          travelExpensePerKm: 0.30,
          accommodation: accommodationType
        })
      });

      router.push('/dashboard/pharmacy');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Fehler beim Erstellen der Vakanz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Neue Vakanz inserieren</h1>
        <p className="text-slate-500 mt-2">Schreibe eine Schicht aus und finde den passenden Vertretungsapotheker.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start border border-red-100">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basisdaten */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800 flex items-center border-b pb-2">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-600" /> Basisdaten
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Titel der Vakanz</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="z.B. Urlaubsvertretung für 2 Wochen"
                className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start (Datum & Uhrzeit)</label>
                <input 
                  type="datetime-local" 
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ende (Datum & Uhrzeit)</label>
                <input 
                  type="datetime-local" 
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warenwirtschaftssystem (WWS)</label>
              <select 
                value={requiredSoftware}
                onChange={e => setRequiredSoftware(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              >
                <option value="Pharmatechnik IXOS">Pharmatechnik IXOS</option>
                <option value="CGM Lauer">CGM Lauer</option>
                <option value="ApothekenSysteme">ApothekenSysteme (ADG)</option>
                <option value="awinta">awinta</option>
                <option value="Andere">Andere</option>
              </select>
            </div>
          </div>

          {/* Konditionen */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800 flex items-center border-b pb-2">
              <Euro className="w-5 h-5 mr-2 text-indigo-600" /> Konditionen & Spesen
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stundenlohn (€/h)</label>
              <p className="text-xs text-slate-500 mb-2">Plattform-Mindestlohn: 45€/h zur Vermeidung von Preisdumping.</p>
              <div className="relative">
                <Euro className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  required
                  min="45"
                  value={salary}
                  onChange={e => setSalary(parseFloat(e.target.value))}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 outline-none transition-colors ${salary < 45 ? 'border-red-300 focus:ring-red-500' : 'focus:ring-indigo-500'}`} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fahrtkostenerstattung (Maximalbetrag)</label>
              <p className="text-xs text-slate-500 mb-2">Die Plattform berechnet standardmäßig 0,30€ pro Kilometer. Hier kannst du einen Maximalbetrag (Cap) festlegen.</p>
              <div className="relative">
                <Euro className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={travelExpenseCap}
                  onChange={e => setTravelExpenseCap(e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Optionaler Cap (z.B. 100)"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                />
              </div>
            </div>

            {/* Accommodation Logic - Conditional Rendering */}
            {daysDifference >= 3 && (
              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 mt-4">
                <label className="block text-sm font-bold text-orange-900 mb-1">Unterkunftsregelung erforderlich</label>
                <p className="text-xs text-orange-700 mb-4">Da die Schicht {daysDifference} aufeinanderfolgende Tage umfasst, musst du eine Unterkunftsregelung anbieten.</p>
                
                <select 
                  required
                  value={accommodationType}
                  onChange={e => setAccommodationType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                >
                  <option value="" disabled>Bitte auswählen...</option>
                  <option value="Wird gestellt (z.B. über der Apotheke)">Wird gestellt (z.B. über der Apotheke)</option>
                  <option value="Hotel wird durch Apotheke gebucht">Hotel wird durch Apotheke gebucht</option>
                  <option value="Pauschalvergütung">Pauschalvergütung (Betrag in Rechnung gestellt)</option>
                </select>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard/pharmacy')}
              className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 mr-4 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading || salary < 45}
              className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Wird gespeichert...' : 'Vakanz inserieren'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
