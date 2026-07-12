'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Save, Building2, MapPin, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    pharmacyName: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    softwareSystem: '',
    licenseDocumentPath: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchPharmacyData();
    }
  }, [user]);

  const fetchPharmacyData = async () => {
    try {
      // Assuming a generic GET /Pharmacy/{id} exists
      const res = await api.get(`/Pharmacy/${user?.id}`);
      const data = res.data;
      setFormData({
        pharmacyName: data.pharmacyName || '',
        street: data.street || '',
        houseNumber: data.houseNumber || '',
        postalCode: data.postalCode || '',
        city: data.city || '',
        softwareSystem: data.softwareSystem || '',
        licenseDocumentPath: data.licenseDocumentPath || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/Pharmacy/${user?.id}`, formData);
      showToast('Einstellungen erfolgreich gespeichert.', 'success');
    } catch (err: any) {
      showToast('Fehler beim Speichern der Daten.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3 transition-all ${
          toast.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-900' : 'bg-red-500/20 border-red-500/30 text-red-900'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">!</div>}
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Einstellungen</h1>
        <p className="text-slate-600 mt-1">Verwalte die Stammdaten und Präferenzen deiner Apotheke.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Stammdaten Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Apotheken Stammdaten</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Name der Apotheke</label>
              <input 
                type="text" 
                value={formData.pharmacyName}
                onChange={e => setFormData({...formData, pharmacyName: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Straße</label>
              <input 
                type="text" 
                value={formData.street}
                onChange={e => setFormData({...formData, street: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hausnummer</label>
              <input 
                type="text" 
                value={formData.houseNumber}
                onChange={e => setFormData({...formData, houseNumber: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PLZ</label>
              <input 
                type="text" 
                value={formData.postalCode}
                onChange={e => setFormData({...formData, postalCode: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ort</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* System & Compliance */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">System & Compliance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warenwirtschaftssystem (WWS)</label>
              <select 
                value={formData.softwareSystem}
                onChange={e => setFormData({...formData, softwareSystem: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                <option value="">Bitte wählen...</option>
                <option value="awinta">awinta / Noventi</option>
                <option value="cgm">CGM Lauer</option>
                <option value="pharmatechnik">Pharmatechnik (IXOS)</option>
                <option value="adg">ADG</option>
                <option value="other">Andere</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apothekenbetriebserlaubnis</label>
              <div className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-between">
                <span className="text-sm truncate">
                  {formData.licenseDocumentPath ? 'Dokument hinterlegt' : 'Kein Dokument hochgeladen'}
                </span>
                <button type="button" className="text-blue-600 text-sm font-semibold hover:underline">Ändern</button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving}
            className="py-3 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Änderungen speichern
          </button>
        </div>
      </form>
    </div>
  );
}
