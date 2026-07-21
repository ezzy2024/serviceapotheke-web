'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Loader2, File } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface PendingVerification {
  id: string;
  type: 'Pharmacist' | 'Pharmacy';
  name: string;
  email: string;
  documentUrl: string | null;
  submittedAt: string;
}

export default function VerificationQueuePage() {
  const [queue, setQueue] = useState<PendingVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PendingVerification | null>(null);
  const toast = useToast();

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('sa_admin_token') || sessionStorage.getItem('sa_admin_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [resPharmacists, resPharmacies] = await Promise.all([
        fetch('https://serviceapotheke.tech/api/Admin/pharmacists/pending', { headers }),
        fetch('https://serviceapotheke.tech/api/Admin/pharmacies/pending', { headers })
      ]);

      const pharmacists = resPharmacists.ok ? await resPharmacists.json() : [];
      const pharmacies = resPharmacies.ok ? await resPharmacies.json() : [];

      const combined: PendingVerification[] = [
        ...pharmacists.map((p: any) => ({
          id: p.id.toString(),
          type: 'Pharmacist' as const,
          name: p.fullName,
          email: p.email,
          documentUrl: p.approbationDocumentPath ? `https://serviceapotheke.tech/api/Admin/document/pharmacist/${p.id}/approbation` : null,
          submittedAt: new Date().toISOString() // API doesn't return created at for pharmacists pending, use current for now
        })),
        ...pharmacies.map((p: any) => ({
          id: p.id.toString(),
          type: 'Pharmacy' as const,
          name: p.pharmacyName,
          email: p.email,
          documentUrl: null, // Pharmacies might not have a document in the payload yet
          submittedAt: new Date().toISOString()
        }))
      ];

      setQueue(combined);
    } catch (err) {
      toast.error('Fehler beim Laden der Warteschlange');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (id: string, type: string) => {
    try {
      const token = localStorage.getItem('sa_admin_token') || sessionStorage.getItem('sa_admin_token');
      const endpoint = type === 'Pharmacist' 
        ? `https://serviceapotheke.tech/api/Admin/pharmacists/${id}/verify`
        : `https://serviceapotheke.tech/api/Admin/pharmacies/${id}/verify`;
        
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setQueue(q => q.filter(item => !(item.id === id && item.type === type)));
        if (selectedItem?.id === id && selectedItem?.type === type) setSelectedItem(null);
        toast.success(`${type} erfolgreich verifiziert.`);
      } else {
        toast.error(`Fehler bei der Verifizierung von ${type}`);
      }
    } catch (err) {
      toast.error('Netzwerkfehler');
    }
  };

  const handleReject = async (id: string, type: string) => {
    // Backend doesn't have a specific reject endpoint yet, we just remove it from queue visually for now
    setQueue(q => q.filter(item => !(item.id === id && item.type === type)));
    if (selectedItem?.id === id && selectedItem?.type === type) setSelectedItem(null);
    toast.success(`${type} abgelehnt.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Verifizierungs-Warteschlange</h1>
        <p className="text-slate-600 mt-2">Ausstehende Approbationsurkunden und Betriebserlaubnisse prüfen.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Queue List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="bg-slate-50 p-4 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
            <span>Ausstehend ({queue.length})</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : queue.length === 0 ? (
              <div className="text-center p-8 text-slate-500">
                Keine offenen Verifizierungen.
              </div>
            ) : (
              <ul className="space-y-2">
                {queue.map(item => (
                  <li key={item.id}>
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left p-4 rounded-lg transition-colors border ${
                        selectedItem?.id === item.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-white border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-900">{item.name}</span>
                        <span className="text-xs px-2 py-1 bg-slate-200 rounded-full text-slate-700 font-medium">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">{item.email}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm h-[700px] flex flex-col">
          {selectedItem ? (
            <>
              <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedItem.name}</h2>
                  <p className="text-slate-600">{selectedItem.email}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleReject(selectedItem.id, selectedItem.type)}
                    className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg flex items-center gap-2 transition"
                  >
                    <XCircle className="w-5 h-5" />
                    Ablehnen
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedItem.id, selectedItem.type)}
                    className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg flex items-center gap-2 transition"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Zulassen
                  </button>
                </div>
              </div>
              
              {selectedItem.type === 'Pharmacy' && (
                <div className="px-6 py-4 border-b border-slate-200 bg-indigo-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-indigo-900">Premium-Funktionen (Freigabe)</h3>
                    <p className="text-sm text-indigo-700/80">Schaltet den Zugang zu pDL und aTM für diese Apotheke frei.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      onChange={async (e) => {
                        try {
                          await fetch(`/api/Admin/pharmacies/${selectedItem.id}/premium-access`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ hasPremiumAccess: e.target.checked })
                          });
                          toast.success(`Premium-Zugang ${e.target.checked ? 'aktiviert' : 'deaktiviert'}.`);
                        } catch (err) {
                          toast.error("Fehler beim Speichern der Premium-Freigabe.");
                        }
                      }}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              )}

              <div className="flex-1 bg-slate-100 p-6 overflow-hidden flex flex-col">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Eingereichtes Dokument
                </h3>
                
                {selectedItem.documentUrl ? (
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                    {/* In a real scenario, this would be an iframe rendering a PDF, or an image tag */}
                    <div className="text-center p-8">
                      <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 mb-4">Das Dokument ist verschlüsselt gespeichert.</p>
                      <a 
                        href={selectedItem.documentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FileText className="w-4 h-4" />
                        Dokument sicher herunterladen
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-white border border-slate-200 border-dashed rounded-lg flex items-center justify-center text-slate-500">
                    Kein Dokument hochgeladen.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p>Wählen Sie einen Eintrag aus der Liste aus.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
