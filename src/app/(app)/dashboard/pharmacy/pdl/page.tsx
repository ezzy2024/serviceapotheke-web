'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { UploadCloud, CheckCircle, FileText, Loader2, Play, Download, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PdlDashboardPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [analyzingIds, setAnalyzingIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/pdl/patients');
      setPatients(res.data);
    } catch (err) {
      showToast('Fehler beim Laden der Patienten.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/pdl/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast(`${res.data.processed} Patienten verarbeitet. ${res.data.newlyEligible} AMTS-berechtigt.`, 'success');
      fetchPatients();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Upload fehlgeschlagen.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async (patientId: number) => {
    setAnalyzingIds(prev => new Set(prev).add(patientId));
    try {
      await api.post(`/pdl/analyze/${patientId}`);
      showToast('AMTS-Analyse erfolgreich abgeschlossen. PDF generiert.', 'success');
      fetchPatients(); // Reload to get PDF url
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Analyse fehlgeschlagen.', 'error');
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(patientId);
        return next;
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3 transition-all ${
          toast.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-900' : 'bg-red-500/20 border-red-500/30 text-red-900'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">Pharmazeutische Dienstleistungen (pDL)</h1>
        <p className="text-slate-600 mt-1">Automatische Identifikation und KI-gestützte Dokumentation von Polymedikationen (AMTS).</p>
      </div>

      {/* Upload Zone */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={`bg-white/70 backdrop-blur-xl border-2 border-dashed rounded-3xl p-10 text-center transition-all ${isUploading ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-white/90'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept=".xlsx,.csv" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} 
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-blue-800 font-medium">Datei wird im Arbeitsspeicher analysiert...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-800 font-medium text-lg">Patientendaten hochladen (.xlsx, .csv)</p>
              <p className="text-slate-500 text-sm mt-1">Drag & Drop oder Klicken zum Auswählen. Daten werden direkt im Arbeitsspeicher verarbeitet.</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Matrix */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100/60 bg-white/40 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Patienten-Matrix
          </h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Keine Patientendaten vorhanden. Bitte laden Sie eine Datei hoch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-600 text-sm font-semibold border-b border-slate-100">
                  <th className="py-4 px-6">Kunden-Nr</th>
                  <th className="py-4 px-6">Alter (Geburt)</th>
                  <th className="py-4 px-6">Geschlecht</th>
                  <th className="py-4 px-6">Verordnungen</th>
                  <th className="py-4 px-6">pDL Status</th>
                  <th className="py-4 px-6 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{p.kdnNr}</td>
                    <td className="py-4 px-6 text-slate-600">{p.geburt}</td>
                    <td className="py-4 px-6 text-slate-600 capitalize">{p.gender}</td>
                    <td className="py-4 px-6 font-medium text-slate-700">{p.medicationCount} Meds</td>
                    <td className="py-4 px-6">
                      {p.isEligibleForAmts ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle className="w-4 h-4" /> AMTS Berechtigt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Nicht Berechtigt
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {p.isEligibleForAmts && !p.hasAnalysis && (
                        <button 
                          onClick={() => handleAnalyze(p.id)}
                          disabled={analyzingIds.has(p.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium text-sm disabled:opacity-50"
                        >
                          {analyzingIds.has(p.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                          AMTS-Analyse starten
                        </button>
                      )}
                      {p.hasAnalysis && p.latestPdfUrl && (
                        <a 
                          href={process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + p.latestPdfUrl} 
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl transition-all font-medium text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Protokoll
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
