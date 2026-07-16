'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { UploadCloud, CheckCircle, FileText, Loader2, Play, Download, AlertTriangle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { useE2EE } from '@/lib/E2EEContext';
import { encryptData, decryptData } from '@/lib/crypto';
import VaultUnlockModal from '@/components/VaultUnlockModal';
import { pdf } from '@react-pdf/renderer';
import { PdlReportDocument } from '@/components/PdlReportDocument';
import { ComplianceBadgesGroup } from '@/components/ui/ComplianceBadges';

export default function PdlDashboardPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [analyzingIds, setAnalyzingIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [skippedStats, setSkippedStats] = useState<{skipped: number, total: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isUnlocked, encryptionKey } = useE2EE();

  useEffect(() => {
    if (isUnlocked && encryptionKey) {
      fetchPatients();
    }
  }, [isUnlocked, encryptionKey]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/pdl/patients');
      // Decrypt incoming data
      const decryptedPatients = [];
      for (const record of res.data) {
        if (record.ciphertextBase64 && record.ivBase64 && encryptionKey) {
          const decryptedStr = await decryptData(encryptionKey, record.ciphertextBase64, record.ivBase64);
          const parsed = JSON.parse(decryptedStr);
          decryptedPatients.push({ ...parsed, id: record.id, hasAnalysis: record.hasAnalysis, latestPdfUrl: record.latestPdfUrl });
        } else {
          // Fallback or unencrypted for backwards compatibility during testing
          decryptedPatients.push(record);
        }
      }
      setPatients(decryptedPatients);
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
    if (!encryptionKey) {
      showToast('Tresor muss entsperrt sein.', 'error');
      return;
    }
    setIsUploading(true);
    
    try {
      // 1. Client-Side Parse
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet);
      
      // 2. Parse rows (horizontal layout)
      const parsedPatients = [];
      let skipped = 0;
      let total = 0;
      
      for (const row of rows as any[]) {
        total++;
        const keys = Object.keys(row);
        
        // Find ID column (case-insensitive regex)
        const kdnKey = keys.find(k => /^(kdn_?nr|kundennr|patientid)/i.test(k));
        
        if (!kdnKey || !row[kdnKey]) {
          skipped++;
          continue;
        }
        
        const kdnNr = row[kdnKey].toString();
        
        // Find birthdate (if available)
        const geburtKey = keys.find(k => /^(geburt|geburtsdatum|geburtsjahr)/i.test(k));
        const geburt = geburtKey ? row[geburtKey]?.toString() : '1960';
        
        // Find all medication columns
        const medications = [];
        for (const key of keys) {
          if (/medikament|medication/i.test(key) && row[key]) {
            medications.push(row[key].toString());
          }
        }
        
        parsedPatients.push({
          kdnNr,
          geburt,
          gender: 'unbekannt', // Fallback for demo
          medications,
          medicationCount: medications.length,
          isEligibleForAmts: medications.length >= 5
        });
      }
      
      setSkippedStats({ skipped, total });
      
      // 3. Client-Side Encrypt
      const encryptedPayloads = [];
      for (const patient of parsedPatients) {
        const stringified = JSON.stringify(patient);
        const { ciphertextBase64, ivBase64 } = await encryptData(encryptionKey, stringified);
        encryptedPayloads.push({ ciphertextBase64, ivBase64 });
      }

      // 4. Transmit to backend
      const res = await api.post('/pdl/ingest', encryptedPayloads);
      showToast(`${res.data.processed} Patienten verschlüsselt und übertragen.`, 'success');
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
    setIsComingSoonOpen(true);
    
    /* GATED: Requires licensed AMTS data provider for clinical interaction logic
    setAnalyzingIds(prev => new Set(prev).add(patientId));
    try {
      const patient = patients.find(p => p.id === patientId);
      if (!patient) throw new Error("Patient not found locally");
      if (!encryptionKey) throw new Error("Encryption key not found");

      // 1. Transmit decrypted matrix to Next.js proxy
      const proxyRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
      });
      
      if (!proxyRes.ok) throw new Error("LLM Analysis failed");
      const analysis = await proxyRes.json();

      // 2. Generate PDF locally via @react-pdf/renderer
      const date = new Date().toLocaleDateString('de-DE');
      const blob = await pdf(<PdlReportDocument patient={patient} analysis={analysis} date={date} />).toBlob();
      
      // Convert Blob to Base64 to save and display later
      const dataUri = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const base64Pdf = dataUri.split(',')[1];

      // 3. Encrypt the analysis and pdf for backend storage
      const reportPayload = JSON.stringify({ analysis, pdf: base64Pdf });
      const { ciphertextBase64, ivBase64 } = await encryptData(encryptionKey, reportPayload);

      // 4. Send to backend
      await api.post(`/pdl/services`, {
        patientId,
        serviceType: 'AMTS_POLYMEDIKATION',
        ciphertextBase64,
        ivBase64
      });

      // Update patient locally with PDF URL
      setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
          return { ...p, hasAnalysis: true, latestPdfUrl: dataUri }; 
        }
        return p;
      }));
      
      showToast('AMTS-Analyse und PDF-Generierung erfolgreich abgeschlossen.', 'success');
    } catch (err: any) {
      showToast(err.message || err.response?.data?.error || 'Analyse fehlgeschlagen.', 'error');
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(patientId);
        return next;
      });
    }
    */
  };

  return (
    <>
      <VaultUnlockModal isOpen={!isUnlocked} onSuccess={() => {}} />
      
      <div className={`max-w-7xl mx-auto space-y-8 ${!isUnlocked ? 'filter blur-md pointer-events-none' : ''}`}>
        {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-ink backdrop-blur-md flex items-center gap-3 transition-all ${
          toast.type === 'success' ? 'bg-lime text-ink' : 'bg-red-400 text-ink'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-ink" /> : <AlertTriangle className="w-5 h-5 text-ink" />}
          <p className="font-bold uppercase tracking-wide">{toast.message}</p>
        </div>
      )}

      {/* Coming Soon Modal */}
      {isComingSoonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
          <div className="bg-bone border-4 border-ink w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
            <button 
              onClick={() => setIsComingSoonOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white border-2 border-ink hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="w-4 h-4 relative">
                <div className="absolute inset-0 w-full h-0.5 bg-ink top-1/2 -translate-y-1/2 rotate-45"></div>
                <div className="absolute inset-0 w-full h-0.5 bg-ink top-1/2 -translate-y-1/2 -rotate-45"></div>
              </div>
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-lime border-4 border-ink flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Lock className="w-8 h-8 text-ink" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-ink uppercase tracking-tight text-center mb-4">AMTS Analyse (Bald verfügbar)</h3>
            <p className="text-ink/80 font-semibold text-center mb-8">
              Die vollautomatisierte KI-gestützte Medikationsanalyse (AMTS) erfordert die Anbindung an einen lizenzierten ABDA-Datenprovider (z.B. pharma4u). Diese Integration wird in Kürze freigeschaltet.
            </p>
            
            <button 
              onClick={() => setIsComingSoonOpen(false)}
              className="w-full py-4 bg-ink text-bone font-black uppercase tracking-widest hover:bg-ink/90 transition-colors border-2 border-ink"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}

      {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Pharmazeutische Dienstleistungen (pDL)</h1>
            <p className="text-slate-600 mt-1">Automatische Identifikation und KI-gestützte Dokumentation von Polymedikationen (AMTS).</p>
          </div>
          <ComplianceBadgesGroup />
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
      
      {skippedStats && skippedStats.skipped > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          className="text-center text-amber-600 font-medium text-sm mt-2"
        >
          <AlertTriangle className="w-4 h-4 inline-block mr-1 -mt-0.5" />
          {skippedStats.skipped} von {skippedStats.total} Zeilen konnten aufgrund eines unerkannten Formats (fehlende ID-Spalte) nicht verarbeitet werden.
        </motion.div>
      )}

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
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium text-sm disabled:opacity-50"
                        >
                          {analyzingIds.has(p.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                          AMTS-Analyse starten
                        </button>
                      )}
                      {p.hasAnalysis && p.latestPdfUrl && (
                        <a 
                          href={p.latestPdfUrl?.startsWith('data:') ? p.latestPdfUrl : (process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + p.latestPdfUrl)} 
                          target="_blank"
                          rel="noreferrer"
                          download={`PDL_AMTS_Report_${p.kdnNr}.pdf`}
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
    </>
  );
}
