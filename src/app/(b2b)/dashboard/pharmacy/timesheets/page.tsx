'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Clock, CheckCircle, AlertTriangle, FileText, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PharmacyTimesheetsPage() {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeId, setDisputeId] = useState<number | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchTimesheets();
    }
  }, [user]);

  const fetchTimesheets = async () => {
    try {
      const res = await api.get(`/Timesheet/pending/pharmacy/${user?.id}`);
      setTimesheets(res.data);
    } catch (err) {
      showToast('Fehler beim Laden der Stundenzettel.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await api.post(`/Timesheet/${id}/approve`);
      showToast('Stundenzettel freigegeben und Rechnungen generiert.', 'success');
      setTimesheets(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Fehler bei der Freigabe.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const openDisputeModal = (id: number) => {
    setDisputeId(id);
    setDisputeReason('');
    setDisputeModalOpen(true);
  };

  const submitDispute = async () => {
    if (!disputeId) return;
    if (!disputeReason.trim()) {
      showToast('Bitte geben Sie einen Grund an.', 'error');
      return;
    }
    
    setProcessingId(disputeId);
    try {
      await api.post(`/Timesheet/${disputeId}/dispute`, { reason: disputeReason });
      showToast('Stundenzettel abgelehnt.', 'success');
      setTimesheets(prev => prev.map(t => t.id === disputeId ? { ...t, status: 'Disputed', disputeReason: disputeReason } : t));
      setDisputeModalOpen(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Fehler bei der Ablehnung.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border ${toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Stundenzettel</h1>
        <p className="text-slate-600">Verwalte und kontrolliere die eingereichten Zeiten der Apotheker.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-slate-100/50 bg-white/30 flex items-center gap-3">
          <FileText className="text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Ausstehende Freigaben</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Apotheker/in</th>
                <th className="px-6 py-4">Datum</th>
                <th className="px-6 py-4">Zeiten</th>
                <th className="px-6 py-4">Spesen</th>
                <th className="px-6 py-4">Gesamt</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {timesheets.map((ts) => (
                <tr key={ts.id} className={`transition-colors ${ts.status === 'Disputed' ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-6 py-4 font-medium text-slate-900">{ts.pharmacistName}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(ts.date).toLocaleDateString('de-DE')}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-slate-400" />
                      {ts.startTime} - {ts.endTime} ({ts.totalHours.toFixed(1)}h)
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div>Fahrt: {ts.travelCosts}€</div>
                    <div>Unterkunft: {ts.accommodationCosts}€</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600">{ts.totalExpected.toFixed(2)} €</td>
                  <td className="px-6 py-4">
                    {ts.status === 'Submitted' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Prüfung ausstehend
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Abgelehnt (Wartet auf Korrektur)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(ts.id)}
                        disabled={processingId !== null || ts.status === 'Disputed'}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                        title="Freigeben & Rechnung erzeugen"
                      >
                        {processingId === ts.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => openDisputeModal(ts.id)}
                        disabled={processingId !== null || ts.status === 'Disputed'}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Ablehnen"
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {timesheets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Keine ausstehenden Stundenzettel vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Modal */}
      <AnimatePresence>
        {disputeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-lg rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="text-red-500" /> Stundenzettel ablehnen
                </h3>
                <button onClick={() => setDisputeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Bitte geben Sie den Grund für die Ablehnung an. Der Apotheker wird benachrichtigt und kann die Zeiten korrigieren.
              </p>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
                className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                placeholder="Beispiel: Es wurden 30 Minuten Pause vergessen."
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                >
                  Abbrechen
                </button>
                <button
                  onClick={submitDispute}
                  disabled={processingId === disputeId || !disputeReason.trim()}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                >
                  {processingId === disputeId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Ablehnen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
