'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Save, Building2, MapPin, Loader2, CheckCircle, ShieldCheck, FileText, Upload } from 'lucide-react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        licenseDocumentPath: data.freelanceContractDocumentPath || data.licenseDocumentPath || ''
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Datei ist zu groß (max. 5MB).', 'error');
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      showToast('Nur PDF, JPG oder PNG erlaubt.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('license', file);
      
      const res = await api.post(`/Pharmacy/${user?.id}/upload-document`, data);
      
      setFormData(prev => ({ ...prev, licenseDocumentPath: res.data.path || '' }));
      showToast('Betriebserlaubnis erfolgreich hochgeladen.', 'success');
    } catch (err) {
      showToast('Fehler beim Upload.', 'error');
    } finally {
      setIsUploading(false);
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
        <h1 className="text-4xl font-bold text-slate-800 uppercase tracking-tight">Einstellungen</h1>
        <p className="text-slate-600 font-bold mt-1">Verwalte die Stammdaten und Prferenzen deiner Apotheke.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Stammdaten Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 shadow-lg rounded-2xl p-0"
        >
          <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-slate-50">
            <Building2 className="w-6 h-6 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Apotheken Stammdaten</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Name der Apotheke</label>
              <input 
                type="text" 
                value={formData.pharmacyName}
                onChange={e => setFormData({...formData, pharmacyName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:shadow-md rounded-xl transition-all font-bold text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Straße</label>
              <input 
                type="text" 
                value={formData.street}
                onChange={e => setFormData({...formData, street: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:shadow-md rounded-xl transition-all font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Hausnummer</label>
              <input 
                type="text" 
                value={formData.houseNumber}
                onChange={e => setFormData({...formData, houseNumber: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:shadow-md rounded-xl transition-all font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">PLZ</label>
              <input 
                type="text" 
                value={formData.postalCode}
                onChange={e => setFormData({...formData, postalCode: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:shadow-md rounded-xl transition-all font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Ort</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:shadow-md rounded-xl transition-all font-bold text-slate-800"
              />
            </div>
          </div>
        </motion.div>

        {/* System & Compliance */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 shadow-lg rounded-2xl p-0"
        >
          <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-emerald-50">
            <ShieldCheck className="w-6 h-6 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">System & Compliance</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Warenwirtschaftssystem (WWS)</label>
              <select 
                value={formData.softwareSystem}
                onChange={e => setFormData({...formData, softwareSystem: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:shadow-md rounded-xl transition-all font-bold text-slate-800"
              >
                <option value="">Bitte whlen...</option>
                <option value="awinta">awinta / Noventi</option>
                <option value="cgm">CGM Lauer</option>
                <option value="pharmatechnik">Pharmatechnik (IXOS)</option>
                <option value="adg">ADG</option>
                <option value="other">Andere</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Apothekenbetriebserlaubnis</label>
              <div className="w-full p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
                
                <div className="flex items-center gap-2">
                  {formData.licenseDocumentPath ? (
                    <>
                      <FileText className="w-5 h-5 text-slate-800" />
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">Dokument hinterlegt</span>
                        <a href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}/Pharmacy/${user?.id}/document/license`} target="_blank" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wide">Ansehen</a>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-slate-800/40" />
                      <span className="text-sm font-bold text-slate-800/60 uppercase tracking-wide">Kein Dokument hochgeladen</span>
                    </>
                  )}
                </div>
                
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white border border-slate-200 text-slate-800 px-4 py-2 font-semibold text-xs tracking-wide shadow-sm rounded-lg hover:-translate-y-0.5 hover:shadow rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  ndern
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-8 py-4 bg-blue-600 border border-slate-200 hover:bg-blue-700 text-white font-semibold transition-all shadow-md rounded-2xl hover:shadow-lg rounded-2xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-md rounded-xl flex items-center gap-3"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            nderungen speichern
          </button>
        </div>
      </form>
    </div>
  );
}
