'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MonitorSmartphone, Link as LinkIcon, Trash2, FileText, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AtmDashboardPage() {
  const [pairingCode, setPairingCode] = useState('');
  const [terminalName, setTerminalName] = useState('');
  const [isPairing, setIsPairing] = useState(false);
  const [terminals, setTerminals] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Developer Mode Simulator
  const [isDevMode, setIsDevMode] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [terminalsRes, ledgerRes] = await Promise.all([
        api.get('/atm/kiosk/terminals'),
        api.get('/atm/kiosk/ledger')
      ]);
      setTerminals(terminalsRes.data);
      setLedger(ledgerRes.data);
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

  const handlePair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingCode) return;
    
    setIsPairing(true);
    try {
      await api.post('/atm/kiosk/pair', { 
        code: pairingCode, 
        terminalName: terminalName || `Kiosk-${pairingCode}` 
      });
      showToast('Kiosk-Terminal erfolgreich gekoppelt.', 'success');
      setPairingCode('');
      setTerminalName('');
      fetchData(); // Refresh list
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Kopplung fehlgeschlagen. Code abgelaufen?', 'error');
    } finally {
      setIsPairing(false);
    }
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
    try {
      // Simulate the terminal's call to the unauthenticated endpoint
      const res = await api.post('/atm/kiosk/initiate');
      setSimulatedCode(res.data.code);
      showToast('Simulator: Kiosk-Code generiert', 'success');
    } catch (err) {
      showToast('Simulator Fehler', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
      </div>

      {isDevMode && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <MonitorSmartphone className="w-5 h-5" />
                Terminal Simulator (Dev Mode)
              </h3>
              <p className="text-slate-400 text-sm mt-1">Simuliert die Code-Generierung eines physischen aTM-Kiosks.</p>
            </div>
            <div className="flex items-center gap-4">
              {simulatedCode && (
                <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-xl tracking-widest text-cyan-300">
                  {simulatedCode}
                </div>
              )}
              <button 
                onClick={simulateKioskInitiate}
                disabled={isGenerating}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
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
                <div key={terminal.id} className="flex items-center justify-between p-4 bg-white/60 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{terminal.name}</h3>
                      <p className="text-xs text-slate-500">Gekoppelt am {new Date(terminal.createdAt).toLocaleDateString('de-DE')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRevoke(terminal.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Zugriff widerrufen"
                  >
                    <Trash2 className="w-5 h-5" />
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
  );
}
