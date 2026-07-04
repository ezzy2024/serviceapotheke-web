'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Briefcase, User, Calendar, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PharmacyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // AÜG Compliance Modal State
  const [isAugModalOpen, setIsAugModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [augConsent, setAugConsent] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/Job/pharmacy/${user?.id}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Failed to load jobs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAugModal = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setAugConsent(false);
    setIsAugModalOpen(true);
  };

  const handleAcceptApplication = async () => {
    if (!augConsent || !selectedApplicationId) return;
    
    setIsAccepting(true);
    try {
      await api.put('/Allocation/accept', {
        applicationId: selectedApplicationId
      });
      setIsAugModalOpen(false);
      fetchJobs(); // Refresh state
    } catch (error) {
      console.error('Failed to accept application', error);
      alert('Fehler beim Akzeptieren der Bewerbung.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Vakanzen & Bewerbungen</h1>
          <p className="text-slate-500 mt-2">Verwalte deine ausgeschriebenen Schichten und wähle Vertretungsapotheker aus.</p>
        </div>
        <Link 
          href="/dashboard/pharmacy/jobs/create" 
          className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Neue Vakanz inserieren
        </Link>
      </div>

      <div className="space-y-6">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Keine Vakanzen</h3>
            <p className="text-slate-500 mt-1">Du hast noch keine Schichten ausgeschrieben.</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
                  <div className="flex items-center text-slate-500 mt-1 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(job.startDate).toLocaleDateString('de-DE')} - {new Date(job.endDate).toLocaleDateString('de-DE')}
                    <span className="mx-2">•</span>
                    {job.salary} €/h
                  </div>
                </div>
                <div className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {job.status}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wider">Eingegangene Bewerbungen</h3>
                
                {(!job.applications || job.applications.length === 0) ? (
                  <p className="text-sm text-slate-500 italic">Noch keine Bewerbungen für diese Schicht.</p>
                ) : (
                  <div className="space-y-3">
                    {job.applications.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{app.pharmacist?.fullName || 'Apotheker'}</p>
                            <p className="text-xs text-slate-500">Bewerbung eingegangen</p>
                          </div>
                        </div>
                        
                        <div>
                          {app.status === 'Pending' && (
                            <button 
                              onClick={() => openAugModal(app.id)}
                              className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                              Akzeptieren
                            </button>
                          )}
                          {app.status === 'Accepted' && (
                            <span className="inline-flex items-center text-sm font-bold text-green-600">
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Bestätigt
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* AÜG Compliance Modal */}
      {isAugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-6">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Rechtliche Bestätigung (AÜG)</h3>
            <p className="text-slate-600 mb-6 text-sm">Zur Vermeidung der Scheinselbstständigkeit ist folgende Bestätigung vor der Beauftragung zwingend erforderlich.</p>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
              <label className="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={augConsent}
                  onChange={(e) => setAugConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-sm text-slate-700 leading-relaxed font-medium">
                  "Ich bestätige rechtsverbindlich, dass der Auftragnehmer ausschließlich als freier Mitarbeiter (Honorarvertretung) beauftragt wird. Es erfolgt keine Eingliederung in die Betriebsstruktur und es besteht kein fachliches Weisungsrecht. Dies stellt ausdrücklich keine Arbeitnehmerüberlassung (AÜG) dar."
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsAugModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleAcceptApplication}
                disabled={!augConsent || isAccepting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isAccepting ? 'Wird verarbeitet...' : 'Rechtsverbindlich beauftragen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
