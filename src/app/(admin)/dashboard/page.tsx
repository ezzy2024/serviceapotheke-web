'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, CheckCircle, XCircle, FileText, Banknote, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [pendingPharmacists, setPendingPharmacists] = useState<any[]>([]);
  const [pendingPharmacies, setPendingPharmacies] = useState<any[]>([]);
  const [finance, setFinance] = useState<{revenue: number, commissionInvoicesCount: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [verifyingId, setVerifyingId] = useState<{type: 'pharmacist'|'pharmacy', id: number} | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [phars, pharms, fin] = await Promise.all([
        api.get('/admin/pharmacists/pending'),
        api.get('/admin/pharmacies/pending'),
        api.get('/admin/finance')
      ]);
      setPendingPharmacists(phars.data);
      setPendingPharmacies(pharms.data);
      setFinance(fin.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        showToast('Keine Admin-Berechtigung.', 'error');
      } else {
        showToast('Fehler beim Laden der Admin-Daten.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({message: msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const verifyAccount = async (type: 'pharmacist'|'pharmacy', id: number) => {
    setVerifyingId({type, id});
    try {
      if (type === 'pharmacist') {
        await api.patch(`/admin/pharmacists/${id}/verify`);
        setPendingPharmacists(prev => prev.filter(p => p.id !== id));
      } else {
        await api.patch(`/admin/pharmacies/${id}/verify`);
        setPendingPharmacies(prev => prev.filter(p => p.id !== id));
      }
      showToast(`${type === 'pharmacist' ? 'Apotheker' : 'Apotheke'} erfolgreich verifiziert.`, 'success');
    } catch (err) {
      showToast('Fehler bei der Verifizierung.', 'error');
    } finally {
      setVerifyingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3 transition-all ${
          toast.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-900' : 'bg-red-500/20 border-red-500/30 text-red-900'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-indigo-900 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-700" />
          Globales Admin-Dashboard
        </h1>
        <p className="text-slate-600 mt-1">Zentrale Verifikation von Approbationen und Finanz-Aggregation.</p>
      </div>

      {/* Finance Panel */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/40 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Banknote className="w-6 h-6 text-emerald-600" />
          Finanz-Aggregation (Plattform-Umsatz)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <p className="text-emerald-800 font-medium text-sm">Aggregierter Plattform-Umsatz</p>
            <p className="text-4xl font-black text-emerald-600 mt-2">
              {finance?.revenue.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'}) || '0,00 €'}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <p className="text-blue-800 font-medium text-sm">Generierte Provisions-Rechnungen</p>
            <p className="text-4xl font-black text-blue-600 mt-2">
              {finance?.commissionInvoicesCount || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Matrix: Pharmacists */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100/60 bg-white/40">
          <h2 className="text-xl font-bold text-slate-800">Verifikations-Matrix: Apotheker</h2>
        </div>
        
        {pendingPharmacists.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Keine ausstehenden Apotheker-Verifikationen.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-600 text-sm font-semibold border-b border-slate-100">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email / Telefon</th>
                  <th className="py-4 px-6">Approbation</th>
                  <th className="py-4 px-6 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPharmacists.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{p.fullName}</td>
                    <td className="py-4 px-6 text-slate-600">{p.email}<br/><span className="text-sm text-slate-400">{p.phoneNumber}</span></td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs mb-2">Land: {p.approbationCountry}</span>
                      <br/>
                      {p.approbationDocumentPath ? (
                        <a 
                          href={process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + p.approbationDocumentPath} 
                          target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          <FileText className="w-4 h-4" /> Urkunde ansehen
                        </a>
                      ) : (
                        <span className="text-sm text-red-500">Kein Dokument</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => verifyAccount('pharmacist', p.id)}
                        disabled={verifyingId?.type === 'pharmacist' && verifyingId?.id === p.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all font-medium text-sm disabled:opacity-50"
                      >
                        {verifyingId?.type === 'pharmacist' && verifyingId?.id === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Freigeben
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Matrix: Pharmacies */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100/60 bg-white/40">
          <h2 className="text-xl font-bold text-slate-800">Verifikations-Matrix: Apotheken</h2>
        </div>
        
        {pendingPharmacies.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Keine ausstehenden Apotheken-Verifikationen.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-600 text-sm font-semibold border-b border-slate-100">
                  <th className="py-4 px-6">Apotheke</th>
                  <th className="py-4 px-6">Email / Adresse</th>
                  <th className="py-4 px-6">Lizenznummer</th>
                  <th className="py-4 px-6 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPharmacies.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{p.pharmacyName}</td>
                    <td className="py-4 px-6 text-slate-600">{p.email}<br/><span className="text-sm text-slate-400">{p.address}</span></td>
                    <td className="py-4 px-6 text-slate-600">{p.licenseNumber}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => verifyAccount('pharmacy', p.id)}
                        disabled={verifyingId?.type === 'pharmacy' && verifyingId?.id === p.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all font-medium text-sm disabled:opacity-50"
                      >
                        {verifyingId?.type === 'pharmacy' && verifyingId?.id === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Freigeben
                      </button>
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
