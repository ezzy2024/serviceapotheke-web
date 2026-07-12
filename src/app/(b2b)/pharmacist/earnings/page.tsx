'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Euro, TrendingUp, Clock, Calendar, Download, Building, AlertTriangle, FileEdit, X, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EarningsPage() {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [reviseModalOpen, setReviseModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>(null);
  const [reviseData, setReviseData] = useState({
    actualStartTime: '',
    actualEndTime: '',
    travelCosts: 0,
    accommodationCosts: 0
  });
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const res = await api.get(`/Earnings/pharmacist/${user?.id}`);
      setEarningsData(res.data);
    } catch (err) {
      console.error('Failed to load earnings', err);
      showToast('Fehler beim Laden der Einnahmen.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openReviseModal = (ts: any) => {
    setSelectedTimesheet(ts);
    setReviseData({
      actualStartTime: ts.startTime,
      actualEndTime: ts.endTime,
      travelCosts: ts.travelCosts,
      accommodationCosts: ts.accommodationCosts
    });
    setReviseModalOpen(true);
  };

  const submitRevise = async () => {
    if (!selectedTimesheet) return;
    setProcessingId(selectedTimesheet.timesheetId);
    try {
      await api.put(`/Timesheet/${selectedTimesheet.timesheetId}/revise`, {
        actualStartDate: selectedTimesheet.date,
        actualStartTime: reviseData.actualStartTime + ':00',
        actualEndTime: reviseData.actualEndTime + ':00',
        travelCosts: reviseData.travelCosts,
        accommodationCosts: reviseData.accommodationCosts
      });
      showToast('Stundenzettel korrigiert und erneut eingereicht.', 'success');
      setReviseModalOpen(false);
      fetchEarnings(); // Refresh data
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Fehler bei der Korrektur.', 'error');
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
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Einnahmen</h1>
        <p className="text-slate-600">Übersicht deiner Schichten, Stundenzettel und Honorare.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Gesamteinnahmen</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Euro className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {earningsData?.totalEarnings?.toLocaleString('de-DE')} €
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Offene Zahlungen</h3>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {earningsData?.pendingPayments?.toLocaleString('de-DE')} €
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Geleistete Schichten</h3>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {earningsData?.history?.length || 0}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Stundenzettel Historie</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Apotheke</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stunden</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gesamt</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {earningsData?.history?.map((item: any, idx: number) => (
                <tr key={idx} className={`transition-colors ${item.status === 'Disputed' ? 'bg-red-50/30' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center text-slate-900 font-medium">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(item.date).toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-sm text-slate-500 ml-6 mt-1">{item.startTime} - {item.endTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-600">
                      <Building className="w-4 h-4 mr-2 text-slate-400" />
                      {item.pharmacyName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.hours}h <span className="text-sm text-slate-400">({item.hourlyRate} €/h)</span></td>
                  <td className="px-6 py-4 text-blue-600 font-bold">{item.total} €</td>
                  <td className="px-6 py-4">
                    {item.status === 'Approved' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> Freigegeben
                      </span>
                    )}
                    {item.status === 'Submitted' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 mr-1" /> In Prüfung
                      </span>
                    )}
                    {item.status === 'Disputed' && (
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Abgelehnt
                        </span>
                        <div className="text-xs text-red-600 bg-white/50 p-2 rounded border border-red-100">
                          <strong>Grund:</strong> {item.disputeReason}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'Disputed' && (
                        <button
                          onClick={() => openReviseModal(item)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center text-sm font-medium gap-1"
                        >
                          <FileEdit className="w-4 h-4" /> Korrigieren
                        </button>
                      )}
                      {item.status === 'Approved' && item.invoiceId && (
                        <button
                          onClick={() => window.open(`/api/InvoiceDownload/${item.invoiceId}/download`, '_blank')}
                          className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center text-sm font-medium gap-1"
                          title="Service-Rechnung herunterladen"
                        >
                          <Download className="w-4 h-4" /> PDF
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!earningsData?.history || earningsData.history.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Bisher keine Schichten dokumentiert.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Revise Modal */}
      <AnimatePresence>
        {reviseModalOpen && selectedTimesheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-lg rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileEdit className="text-blue-600" /> Zeiten korrigieren
                </h3>
                <button onClick={() => setReviseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Passe deine Zeiten entsprechend der Beanstandung an und reiche sie erneut ein.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Startzeit</label>
                    <input
                      type="time"
                      value={reviseData.actualStartTime}
                      onChange={(e) => setReviseData({...reviseData, actualStartTime: e.target.value})}
                      className="w-full border-slate-200 rounded-xl p-2 bg-white/50 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Endzeit</label>
                    <input
                      type="time"
                      value={reviseData.actualEndTime}
                      onChange={(e) => setReviseData({...reviseData, actualEndTime: e.target.value})}
                      className="w-full border-slate-200 rounded-xl p-2 bg-white/50 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fahrspesen (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={reviseData.travelCosts}
                      onChange={(e) => setReviseData({...reviseData, travelCosts: parseFloat(e.target.value) || 0})}
                      className="w-full border-slate-200 rounded-xl p-2 bg-white/50 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unterkunft (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={reviseData.accommodationCosts}
                      onChange={(e) => setReviseData({...reviseData, accommodationCosts: parseFloat(e.target.value) || 0})}
                      className="w-full border-slate-200 rounded-xl p-2 bg-white/50 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setReviseModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                >
                  Abbrechen
                </button>
                <button
                  onClick={submitRevise}
                  disabled={processingId === selectedTimesheet.timesheetId}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                >
                  {processingId === selectedTimesheet.timesheetId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Speichern & Einreichen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
