'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Briefcase, Building, Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function PharmacistShifts() {
  const { user } = useAuth();
  const toast = useToast();
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Freelancer Compliance Modal State
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [augConsent, setAugConsent] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // New Timesheet Form State
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:30");
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [timesheetError, setTimesheetError] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchShifts();
    }
  }, [user]);

  const fetchShifts = async () => {
    try {
      // In a real scenario we might have GET /api/Allocation/pharmacist/{id}
      // Or use the existing GetUpcomingShifts / GetCompletedShifts / GetAllShifts 
      // For this UI, let's assume we can fetch all applications for this pharmacist
      const res = await api.get(`/Pharmacist/${user?.id}/all-shifts`);
      setShifts(res.data);
    } catch (error) {
      console.error('Failed to load shifts', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openComplianceModal = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setAugConsent(false);
    setTimesheetError("");
    
    const shift = shifts.find(s => s.id === applicationId);
    if (shift?.jobPost) {
      const start = shift.jobPost.startDate ? new Date(shift.jobPost.startDate).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}) : "08:00";
      const end = shift.jobPost.endDate ? new Date(shift.jobPost.endDate).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}) : "16:30";
      setStartTime(start);
      setEndTime(end);
      setBreakMinutes(30);
    }
    
    setIsComplianceModalOpen(true);
  };

  const handleCompleteShift = async () => {
    if (!augConsent || !selectedApplicationId) return;
    
    setTimesheetError("");
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    
    if (totalMinutes <= 0) {
        setTimesheetError("Die Endzeit muss nach der Startzeit liegen.");
        return;
    }
    if (breakMinutes >= totalMinutes) {
        setTimesheetError("Die Pausenzeit darf nicht länger als die gesamte Schichtdauer sein.");
        return;
    }
    
    setIsCompleting(true);
    try {
      const shift = shifts.find(s => s.id === selectedApplicationId);
      
      // 1. Submit Timesheet
      try {
        await api.post('/Timesheet/submit', {
          jobApplicationId: selectedApplicationId,
          actualStartDate: shift?.jobPost?.startDate || new Date().toISOString(),
          actualStartTime: `${startTime}:00`,
          actualEndTime: `${endTime}:00`,
          breaksMinutes: breakMinutes,
          hourlyRate: shift?.jobPost?.salary || 0,
          travelCosts: 0,
          accommodationCosts: 0,
          status: 'Submitted'
        });
      } catch (err: any) {
        console.error('Failed to submit timesheet', err);
        let msg = 'Fehler beim Einreichen des Stundenzettels. Bitte überprüfe deine Eingaben.';
        if (typeof err.response?.data?.message === 'string' && err.response.data.message.trim() !== '') {
          msg = err.response.data.message;
        } else if (typeof err.response?.data?.title === 'string' && err.response.data.title.trim() !== '') {
          msg = err.response.data.title;
        } else if (typeof err.response?.data?.detail === 'string' && err.response.data.detail.trim() !== '') {
          msg = err.response.data.detail;
        } else if (typeof err.response?.data === 'string' && err.response.data.trim() !== '') {
          msg = err.response.data;
        } else if (err.response?.data?.errors) {
            const firstError = Object.values(err.response.data.errors)[0] as string[];
            if (firstError && firstError.length > 0) msg = firstError[0];
        }
        toast.error(msg);
        setIsCompleting(false);
        return;
      }

      // Removed api.put that manually mutated JobApplication status to 'Completed'

      toast.success('Schicht erfolgreich abgeschlossen.');
      setIsComplianceModalOpen(false);
      fetchShifts(); // Refresh state
    } catch (err: any) {
      console.error('Failed to complete shift', err);
      let msg = 'Fehler beim Aktualisieren des Schichtstatus.';
      if (typeof err.response?.data?.message === 'string' && err.response.data.message.trim() !== '') {
        msg = err.response.data.message;
      } else if (typeof err.response?.data?.title === 'string' && err.response.data.title.trim() !== '') {
        msg = err.response.data.title;
      } else if (typeof err.response?.data?.detail === 'string' && err.response.data.detail.trim() !== '') {
        msg = err.response.data.detail;
      }
      toast.error(msg);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Meine Schichten</h1>
        <p className="text-slate-500 mt-2">Hier verwaltest du deine bestätigten Schichten und reichst Stundenzettel ein.</p>
      </div>

      <div className="space-y-6">
        {shifts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Keine aktiven Schichten</h3>
            <p className="text-slate-500 mt-1">Du hast aktuell keine bestätigten Schichten. Finde neue Vakanzen im Radar.</p>
          </div>
        ) : (
          shifts.map(shift => {
            const job = shift.jobPost;
            return (
              <div key={shift.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-slate-800">{job?.title || 'Vertretungsschicht'}</h2>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      (shift.status === 'Accepted' && shift.timesheetStatus === 'Submitted') || shift.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      shift.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                      shift.status === 'Invoiced' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {(shift.status === 'Accepted' && shift.timesheetStatus === 'Submitted') ? 'Completed' : shift.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-slate-600 mb-4 font-medium">
                    <Building className="w-4 h-4 mr-2 text-blue-600" />
                    {job?.pharmacy?.pharmacyName || 'Apotheke'}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Zeitraum</div>
                      <div className="font-semibold text-slate-700 text-sm">
                        {job?.startDate ? new Date(job.startDate).toLocaleDateString('de-DE') : ''}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1 flex items-center"><Clock className="w-3 h-3 mr-1"/> Konditionen</div>
                      <div className="font-semibold text-slate-700 text-sm">
                        {job?.salary} €/h
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:w-1/3 bg-slate-50/50 flex flex-col justify-center items-center text-center">
                  {shift.status === 'Accepted' && shift.timesheetStatus !== 'Submitted' && shift.timesheetStatus !== 'Approved' && (
                    <>
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">Schicht anstehend</h4>
                      <p className="text-xs text-slate-500 mb-4 px-4">Nach Beendigung der Schicht kannst du hier den Stundenzettel einreichen.</p>
                      <button 
                        onClick={() => openComplianceModal(shift.id)}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                      >
                        Schicht abschließen
                      </button>
                    </>
                  )}

                  {(shift.status === 'Completed' || (shift.status === 'Accepted' && shift.timesheetStatus === 'Submitted')) && (
                    <>
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">Stundenzettel eingereicht</h4>
                      <p className="text-xs text-slate-500 px-4">Warte auf Freigabe und automatische Rechnungserstellung durch das System.</p>
                    </>
                  )}

                  {shift.status === 'Invoiced' && (
                    <>
                      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">In Rechnung gestellt</h4>
                      <p className="text-xs text-slate-500 px-4">Die Rechnung wurde automatisch per PDF versendet.</p>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Freelancer Compliance Modal */}
      {isComplianceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-6">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Rechtliche Bestätigung (Freelancer)</h3>
            <p className="text-slate-600 mb-6 text-sm">Zur finalen Rechnungsstellung und Vermeidung der Scheinselbstständigkeit ist diese Bestätigung erforderlich.</p>
            
            {timesheetError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {timesheetError}
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Startzeit</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Endzeit</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pause (Min)</label>
                <input type="number" min="0" value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 text-slate-700" />
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
              <label className="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={augConsent}
                  onChange={(e) => setAugConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-slate-700 leading-relaxed font-medium">
                  "Ich bestätige rechtsverbindlich, dass ich diese Schicht als eigenverantwortlicher, weisungsfreier Honorarvertreter erbracht habe. Die ordnungsgemäße Abführung sämtlicher anfallender Steuern und Sozialabgaben obliegt vollumfänglich mir."
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsComplianceModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleCompleteShift}
                disabled={!augConsent || isCompleting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isCompleting ? 'Wird verarbeitet...' : 'Schicht rechtsverbindlich abschließen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
