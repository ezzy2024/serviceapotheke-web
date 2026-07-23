'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Euro, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

type ShiftDay = {
  date: string;
  startTime: string;
  endTime: string;
  pauseMinutes: number;
};

import { Suspense } from 'react';

function CreateJobPostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mode: Single or Multi-day
  const [isMultiDay, setIsMultiDay] = useState(false);

  // Single Day State
  const [singleDate, setSingleDate] = useState('');
  const [singleStart, setSingleStart] = useState('08:00');
  const [singleEnd, setSingleEnd] = useState('18:00');
  const [singlePause, setSinglePause] = useState<number>(30);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      try {
        const d = new Date(dateParam);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const dateStr = ${yyyy}--;
          setSingleDate(dateStr);
          setMultiStartDate(dateStr);
          setMultiEndDate(dateStr);
        }
      } catch (e) {}
    }
  }, [searchParams]);

  // Multi Day State
  const [multiStartDate, setMultiStartDate] = useState('');
  const [multiEndDate, setMultiEndDate] = useState('');
  const [shifts, setShifts] = useState<ShiftDay[]>([]);

  // Other Form State
  const [salary, setSalary] = useState<number>(45); 
  const [requiredSoftware, setRequiredSoftware] = useState('Pharmatechnik IXOS');
  const [customSoftware, setCustomSoftware] = useState('');
  const [travelExpenseCap, setTravelExpenseCap] = useState<number | ''>('');
  const [requiredQualification, setRequiredQualification] = useState('Approbation');
  const [reasonForVacancy, setReasonForVacancy] = useState('Urlaub');
  const [accommodationType, setAccommodationType] = useState('');
  const [daysDifference, setDaysDifference] = useState(0);

  // Fetch Pharmacy WWS
  useEffect(() => {
    if (user?.id) {
      api.get(`/Pharmacy/${user.id}`).then(res => {
        if (res.data?.softwareSystem) {
          const sys = res.data.softwareSystem;
          const known = ['Pharmatechnik IXOS', 'CGM Lauer', 'ApothekenSysteme', 'awinta', 'Sanitas'];
          if (known.includes(sys)) {
            setRequiredSoftware(sys);
          } else {
            setRequiredSoftware('Andere');
            setCustomSoftware(sys);
          }
        }
      }).catch(err => console.error("Could not fetch pharmacy profile", err));
    }
  }, [user]);

  // Generate shifts array when dates change in multi-day mode
  useEffect(() => {
    if (isMultiDay && multiStartDate && multiEndDate) {
      const start = new Date(multiStartDate);
      const end = new Date(multiEndDate);
      
      if (start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
        setDaysDifference(diffDays);

        const newShifts: ShiftDay[] = [];
        for (let i = 0; i < diffDays; i++) {
          const d = new Date(start);
          d.setDate(d.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          
          // Preserve existing entries if they match the date
          const existing = shifts.find(s => s.date === dateStr);
          if (existing) {
            newShifts.push(existing);
          } else {
            newShifts.push({
              date: dateStr,
              startTime: '08:00',
              endTime: '18:00',
              pauseMinutes: 30
            });
          }
        }
        setShifts(newShifts);
      } else {
        setShifts([]);
        setDaysDifference(0);
      }
    } else if (!isMultiDay && singleDate) {
      setDaysDifference(1);
    }
    
    if (daysDifference < 3) {
      setAccommodationType('');
    }
  }, [isMultiDay, multiStartDate, multiEndDate, singleDate]);

  const updateShift = (index: number, field: keyof ShiftDay, value: string | number) => {
    const updated = [...shifts];
    updated[index] = { ...updated[index], [field]: value };
    setShifts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-flight Validations
    let finalStartIso = '';
    let finalEndIso = '';
    let shiftPayload: any = {};

    if (isMultiDay) {
      if (new Date(multiStartDate) > new Date(multiEndDate)) {
        setError('Das Enddatum muss nach dem Startdatum liegen.');
        return;
      }
      if (shifts.length === 0) {
        setError('Bitte wähle ein gültiges Start- und Enddatum.');
        return;
      }
      finalStartIso = new Date(`${shifts[0].date}T${shifts[0].startTime}:00`).toISOString();
      const last = shifts[shifts.length - 1];
      finalEndIso = new Date(`${last.date}T${last.endTime}:00`).toISOString();
      
      shiftPayload = {
        isMultiDay: true,
        shifts: shifts
      };
    } else {
      if (!singleDate) {
        setError('Bitte wähle ein Datum.');
        return;
      }
      finalStartIso = new Date(`${singleDate}T${singleStart}:00`).toISOString();
      finalEndIso = new Date(`${singleDate}T${singleEnd}:00`).toISOString();
      
      if (new Date(finalStartIso) >= new Date(finalEndIso)) {
        setError('Das Ende der Schicht muss nach dem Start liegen.');
        return;
      }

      shiftPayload = {
        isMultiDay: false,
        shifts: [{
          date: singleDate,
          startTime: singleStart,
          endTime: singleEnd,
          pauseMinutes: singlePause
        }]
      };
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
      const descriptionJson = JSON.stringify({
        travelExpenseCap: travelExpenseCap,
        travelExpensePerKm: 0.30,
        accommodation: accommodationType
      });

      await api.post('/Job', {
        pharmacyId: parseInt(user?.id || '0'),
        startDate: finalStartIso,
        endDate: finalEndIso,
        salary,
        requiredQualifications: requiredQualification,
        requiredWws: requiredSoftware === 'Andere' ? customSoftware : requiredSoftware,
        reasonForVacancy: reasonForVacancy,
        isUrgent: false,
        description: descriptionJson,
        shiftDetails: JSON.stringify(shiftPayload)
      });

      router.push('/dashboard/pharmacy');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Fehler beim Erstellen der Vakanz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
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
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Vakanz Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Benötigte Qualifikation</label>
                <select 
                  value={requiredQualification}
                  onChange={e => setRequiredQualification(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option value="Approbation">Approbierte/r Apotheker/in</option>
                  <option value="PTA">PTA</option>
                  <option value="PKA">PKA</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vertretungsgrund</label>
                <select 
                  value={reasonForVacancy}
                  onChange={e => setReasonForVacancy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option value="Urlaub">Urlaubsvertretung</option>
                  <option value="Krankheit">Krankheitsausfall</option>
                  <option value="Engpass">Personalengpass</option>
                  <option value="Notdienst">Notdienst</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warenwirtschaftssystem (WWS)</label>
              <select 
                value={requiredSoftware}
                onChange={e => {
                  setRequiredSoftware(e.target.value);
                  if (e.target.value !== 'Andere') setCustomSoftware('');
                }}
                className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors mb-2"
              >
                <option value="Pharmatechnik IXOS">Pharmatechnik IXOS</option>
                <option value="CGM Lauer">CGM Lauer</option>
                <option value="ApothekenSysteme">ApothekenSysteme (ADG)</option>
                <option value="awinta">awinta</option>
                <option value="Sanitas">Sanitas</option>
                <option value="Andere">Andere (Bitte angeben)</option>
              </select>
              
              {requiredSoftware === 'Andere' && (
                <input 
                  type="text" 
                  value={customSoftware}
                  onChange={e => setCustomSoftware(e.target.value)}
                  placeholder="Welches WWS wird verwendet?"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
              )}
            </div>
          </div>

          {/* Schichten */}
          <div className="space-y-5 pt-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center border-b pb-2">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" /> Zeiten & Schichten
            </h2>

            <div className="flex space-x-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  checked={!isMultiDay} 
                  onChange={() => setIsMultiDay(false)} 
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                />
                <span className="ml-2 text-slate-700 font-medium">Tagesweise (1 Tag)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  checked={isMultiDay} 
                  onChange={() => setIsMultiDay(true)} 
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                />
                <span className="ml-2 text-slate-700 font-medium">Mehrtägig</span>
              </label>
            </div>

            {!isMultiDay ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Datum</label>
                  <input 
                    type="date" 
                    required
                    value={singleDate}
                    onChange={e => setSingleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Start</label>
                  <input 
                    type="time" 
                    required
                    value={singleStart}
                    onChange={e => setSingleStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Ende</label>
                  <input 
                    type="time" 
                    required
                    value={singleEnd}
                    onChange={e => setSingleEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Pause (Min)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={singlePause}
                    onChange={e => setSinglePause(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Startdatum</label>
                    <input 
                      type="date" 
                      required
                      value={multiStartDate}
                      onChange={e => setMultiStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Enddatum</label>
                    <input 
                      type="date" 
                      required
                      value={multiEndDate}
                      onChange={e => setMultiEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                </div>

                {shifts.length > 0 && (
                  <div className="mt-6 border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-100 px-4 py-3 border-b flex justify-between items-center">
                      <span className="font-semibold text-slate-700 text-sm">Tägliche Arbeitszeiten</span>
                      <span className="text-xs text-slate-500">{shifts.length} Tage ausgewählt</span>
                    </div>
                    <div className="divide-y max-h-[400px] overflow-y-auto">
                      {shifts.map((shift, idx) => (
                        <div key={idx} className="p-4 bg-white grid grid-cols-1 sm:grid-cols-4 gap-4 items-center hover:bg-slate-50 transition-colors">
                          <div className="sm:col-span-1 font-medium text-slate-800">
                            {new Date(shift.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 sm:hidden">Start</label>
                            <input 
                              type="time" 
                              required
                              value={shift.startTime}
                              onChange={e => updateShift(idx, 'startTime', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 sm:hidden">Ende</label>
                            <input 
                              type="time" 
                              required
                              value={shift.endTime}
                              onChange={e => updateShift(idx, 'endTime', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 mb-1 sm:hidden">Pause (Min)</label>
                            <div className="flex items-center">
                              <input 
                                type="number" 
                                required
                                min="0"
                                value={shift.pauseMinutes}
                                onChange={e => updateShift(idx, 'pauseMinutes', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                              />
                              <span className="ml-2 text-xs text-slate-400 hidden sm:inline-block">Min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Konditionen */}
          <div className="space-y-5 pt-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center border-b pb-2">
              <Euro className="w-5 h-5 mr-2 text-blue-600" /> Konditionen & Spesen
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
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 outline-none transition-colors ${salary < 45 ? 'border-red-300 focus:ring-red-500' : 'focus:ring-blue-500'}`} 
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
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
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
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
              className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Wird gespeichert...' : 'Vakanz inserieren'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function CreateJobPost() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Lade Formular...</div>}>
      <CreateJobPostContent />
    </Suspense>
  );
}

