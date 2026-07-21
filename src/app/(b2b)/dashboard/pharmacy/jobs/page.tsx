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
  
  // Freelancer Compliance Modal State
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
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

  const openComplianceModal = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setAugConsent(false);
    setIsComplianceModalOpen(true);
  };

  const handleAcceptApplication = async () => {
    if (!augConsent || !selectedApplicationId) return;
    
    setIsAccepting(true);
    try {
      await api.put(`/Allocation/shift/${selectedApplicationId}/status`, {
        newStatus: 'Accepted'
      });
      setIsComplianceModalOpen(false);
      fetchJobs(); // Refresh state
    } catch (error) {
      console.error('Failed to accept application', error);
      alert('Fehler beim Akzeptieren der Bewerbung.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Vakanzen & Bewerbungen</h1>
          <p className="text-slate-500 mt-2">Verwalte deine ausgeschriebenen Schichten und wähle Vertretungsapotheker aus.</p>
        </div>
        <Link 
          href="/dashboard/pharmacy/jobs/create" 
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
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
            <div key={job.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-slate-100 flex items-center bg-white">
                <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-100 text-blue-700 rounded-xl w-16 h-16 mr-6 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider">{new Date(job.startDate).toLocaleString('de-DE', { month: 'short' })}</span>
                  <span className="text-2xl font-bold">{new Date(job.startDate).getDate()}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
                  <div className="flex items-center text-slate-500 mt-1 text-sm">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {new Date(job.startDate).toLocaleDateString('de-DE')} - {new Date(job.endDate).toLocaleDateString('de-DE')}
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-slate-700">{job.salary} €/h</span>
                  </div>
                </div>
                <div className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100">
                  {job.status}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wider">Eingegangene Bewerbungen</h3>
                
                {(!job.jobApplications || job.jobApplications.length === 0) ? (
                  <p className="text-sm text-slate-500 italic">Noch keine Bewerbungen für diese Schicht.</p>
                ) : (
                  <div className="space-y-4">
                    {job.jobApplications.map((app: any) => (
                      <div key={app.id} className="flex flex-col p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-cyan-300 transition-all">
                        
                        <div className="flex items-start justify-between w-full">
                          {/* Profile Header */}
                          <div className="flex items-center space-x-4">
                            {app.pharmacist?.profilePicturePath ? (
                              <img 
                                src={`https://serviceapotheke.tech/api/Pharmacist/${app.pharmacist.id}/document/profile`} 
                                alt={app.pharmacist.fullName} 
                                className="w-14 h-14 rounded-full object-cover border border-slate-200" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }}
                              />
                            ) : null}
                            <div className={app.pharmacist?.profilePicturePath ? "hidden w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600" : "w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600"}>
                              <User className="w-6 h-6" />
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-bold text-slate-800">{app.pharmacist?.fullName || 'Apotheker'}</h4>
                              <p className="text-sm text-slate-500 font-medium">Bewerbung eingegangen</p>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex space-x-3 items-center">
                            {app.status === 'Pending' && (
                              <button 
                                onClick={() => openComplianceModal(app.id)}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
                              >
                                Akzeptieren
                              </button>
                            )}
                            {app.status === 'Accepted' && (
                              <span className="inline-flex items-center px-4 py-2 bg-green-50 text-sm font-bold text-green-700 rounded-xl border border-green-200">
                                <CheckCircle2 className="w-5 h-5 mr-2" /> Bestätigt
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Profile Details Grid */}
                        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Honorar</p>
                            <p className="font-bold text-slate-800">{app.pharmacist?.hourlyRate} €/h</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Erfahrung</p>
                            <p className="font-bold text-slate-800">{app.pharmacist?.experienceYears || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">WWS Systeme</p>
                            <p className="font-bold text-slate-800 truncate" title={app.pharmacist?.wwsProficiency}>{app.pharmacist?.wwsProficiency || '-'}</p>
                          </div>
                          {app.status === 'Accepted' && (
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Kontakt</p>
                              <p className="font-bold text-blue-600">{app.pharmacist?.email || '-'}</p>
                              <p className="font-bold text-slate-700">{app.pharmacist?.phoneNumber || '-'}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Verification Documents */}
                        <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`flex h-2 w-2 rounded-full ${app.pharmacist?.approbationDocumentPath ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            <span className="text-sm font-semibold text-slate-700">
                              {app.pharmacist?.approbationDocumentPath ? 'KYC Verifiziert (Approbationsurkunde liegt vor)' : 'KYC Ausstehend (Kein Dokument)'}
                            </span>
                          </div>
                          {app.pharmacist?.approbationDocumentPath ? (
                            <a 
                              href={`https://serviceapotheke.tech/api/Pharmacist/${app.pharmacist.id}/document/approbation`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-bold text-blue-600 hover:text-blue-800 underline"
                            >
                              Dokument prüfen
                            </a>
                          ) : (
                            <span className="text-sm text-slate-400 italic">Fehlt</span>
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

      {/* Freelancer Compliance Modal */}
      {isComplianceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-6">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Rechtliche Bestätigung (Freelancer)</h3>
            <p className="text-slate-600 mb-6 text-sm">Zur Vermeidung der Scheinselbstständigkeit ist folgende Bestätigung vor der Beauftragung zwingend erforderlich.</p>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
              <label className="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={augConsent}
                  onChange={(e) => setAugConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-slate-700 leading-relaxed font-medium">
                  "Ich bestätige rechtsverbindlich, dass der Auftragnehmer ausschließlich als freier Mitarbeiter (Honorarvertretung) beauftragt wird. Es erfolgt keine Eingliederung in die Betriebsstruktur und es besteht kein fachliches Weisungsrecht. Dies stellt ausdrücklich keine Arbeitnehmerüberlassung dar."
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
                onClick={handleAcceptApplication}
                disabled={!augConsent || isAccepting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 transition-all flex items-center shadow-md hover:shadow-lg"
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
