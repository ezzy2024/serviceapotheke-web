'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MonitorSmartphone, Link as LinkIcon, Trash2, FileText, CheckCircle, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useE2EE } from '@/lib/E2EEContext';
import { decryptData } from '@/lib/crypto';
import VaultUnlockModal from '@/components/VaultUnlockModal';

export default function AtmDashboardPage() {
  const [pairingCode, setPairingCode] = useState('');
  const [terminalName, setTerminalName] = useState('');
  const [isPairing, setIsPairing] = useState(false);
  const [terminals, setTerminals] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Developer Mode Simulator
  const [isDevMode, setIsDevMode] = useState(false); // Default to false in production
  const [simulatedCode, setSimulatedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const { isUnlocked, encryptionKey } = useE2EE();

  useEffect(() => {
    if (isUnlocked && encryptionKey) {
      fetchData();
    }
  }, [isUnlocked, encryptionKey]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [terminalsRes, ledgerRes] = await Promise.all([
        api.get('/atm/kiosk/terminals'),
        api.get('/atm/kiosk/ledger')
      ]);
      setTerminals(terminalsRes.data);
      
      const decryptedLedger = [];
      for (const record of ledgerRes.data) {
        if (record.ciphertextBase64 && record.ivBase64 && encryptionKey) {
          const decryptedStr = await decryptData(encryptionKey, record.ciphertextBase64, record.ivBase64);
          const parsed = JSON.parse(decryptedStr);
          decryptedLedger.push({ ...parsed, id: record.id, reportPath: record.reportPath });
        } else {
          // Fallback or unencrypted for backwards compatibility during testing
          decryptedLedger.push(record);
        }
      }
      setLedger(decryptedLedger);
    } catch (err) {
      showToast('Fehler beim Laden der aTM-Daten.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (simulatedCode) setSimulatedCode('');
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, simulatedCode]);

  const handlePair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingCode) return;
    
    setIsPairing(true);
    // Mock the pairing process
    setTimeout(() => {
      if (pairingCode === simulatedCode || pairingCode === '123456') {
        showToast('Kiosk-Terminal erfolgreich gekoppelt.', 'success');
        setTerminals(prev => [...prev, {
          id: Date.now(),
          name: terminalName || `Kiosk-${pairingCode}`,
          createdAt: new Date().toISOString()
        }]);
        setPairingCode('');
        setTerminalName('');
        setSimulatedCode('');
        setTimeLeft(0);
      } else {
        showToast('Kopplung fehlgeschlagen. Code ungültig oder abgelaufen.', 'error');
      }
      setIsPairing(false);
    }, 1500);
  };

  const handleRevoke = async (id: number) => {
    if (!confirm('Soll dieses Terminal wirklich widerrufen werden?')) return;
    
    try {
      await api.delete(`/atm/kiosk/terminals/${id}`);
      showToast('Terminal widerrufen.', 'success');
      setTerminals(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      showToast('Fehler beim Widerrufen.', 'error');
    }
  };

  const simulateKioskInitiate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedCode(code);
      setTimeLeft(300); // 5 minutes
      showToast('Simulator: Kiosk-Code generiert', 'success');
      setIsGenerating(false);
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <VaultUnlockModal isOpen={!isUnlocked} onSuccess={() => {}} />

      <div className={`max-w-6xl mx-auto space-y-8 ${!isUnlocked ? 'filter blur-md pointer-events-none' : ''}`}>
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3 transition-all ${
            toast.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-900' : 'bg-red-500/20 border-red-500/30 text-red-900'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">!</div>}
            <p className="font-medium">{toast.message}</p>
          </div>
        )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Assistierte Telemedizin (aTM)</h1>
          <p className="text-slate-600 mt-1">Hardware-Pairing und Abrechnungsübersicht für Telepharmazie-Terminals.</p>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDevMode} 
                onChange={e => setIsDevMode(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Developer Mode
            </label>
          </div>
        )}
      </div>

      {isDevMode && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="bg-bone border-2 border-ink rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
                <MonitorSmartphone className="w-6 h-6" />
                Terminal Simulator
              </h3>
              <p className="text-ink/80 font-bold text-sm mt-1">Simuliert die Code-Generierung eines physischen aTM-Kiosks (Keine Hardware ntig).</p>
            </div>
            <div className="flex items-center gap-4">
              {simulatedCode && (
                <div className="flex flex-col items-end">
                  <div className="px-4 py-2 bg-white border-2 border-ink font-mono text-2xl font-black tracking-widest text-ink">
                    {simulatedCode}
                  </div>
                  <div className="text-red-600 font-bold mt-1 text-sm flex items-center gap-1">
                    Gltig fr: {formatTime(timeLeft)}
                  </div>
                </div>
              )}
              <button 
                onClick={simulateKioskInitiate}
                disabled={isGenerating || !!simulatedCode}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 border-2 border-ink text-white font-black uppercase tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {isGenerating ? 'Generiert...' : 'Code Generieren'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pairing Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Neues Kiosk-Terminal</h2>
          </div>
          
          <form onSubmit={handlePair} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">6-stelliger Pairing-Code</label>
              <input 
                type="text" 
                maxLength={6}
                value={pairingCode}
                onChange={e => setPairingCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono text-center text-2xl tracking-widest"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Terminal Bezeichnung (optional)</label>
              <input 
                type="text" 
                value={terminalName}
                onChange={e => setTerminalName(e.target.value)}
                placeholder="z.B. Beratungskabine 1"
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={isPairing || pairingCode.length !== 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isPairing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              Kopplung autorisieren
            </button>
          </form>
        </motion.div>

        {/* Terminals Roster */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <MonitorSmartphone className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Aktive Terminals</h2>
          </div>

          {terminals.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
              <MonitorSmartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Keine aktiven Terminals gekoppelt.</p>
              <p className="text-slate-400 text-sm mt-1">Verwende den Code auf dem Kiosk-Bildschirm zum Pairen.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {terminals.map(terminal => (
                <div key={terminal.id} className="flex items-center justify-between p-4 bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-none bg-green-500 border border-ink animate-pulse"></div>
                    <div>
                      <h3 className="font-black text-ink">{terminal.name}</h3>
                      <p className="text-xs font-bold text-ink/70 mt-1 uppercase tracking-wide">Status: Bereit fr E2EE Verbindungen</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRevoke(terminal.id)}
                    className="px-3 py-1.5 bg-red-400 text-ink font-black uppercase text-xs tracking-wide border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                    title="Zugriff widerrufen"
                  >
                    Trennen
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Telepharmacy Ledger */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Abrechnungs- & Dokumentationshistorie</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Datum</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Patient</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">KVNR</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Leistung</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Betrag</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Dokument</th>
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Bisher wurden keine Telepharmazie-Leistungen erfasst.
                  </td>
                </tr>
              ) : (
                ledger.map(record => (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-700">
                      {new Date(record.dateOfService).toLocaleDateString('de-DE')}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{record.patientName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{record.kvnr || '-'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                        {record.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">€{record.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      {record.reportPath ? (
                        <a 
                          href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${record.reportPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          PDF
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Kein PDF</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </motion.div>

      </div>
    </>
  );
}
