'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { User, Phone, MapPin, FileText, CheckCircle2, AlertCircle, UploadCloud, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const approbationInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    maxDistanceKm: 50,
    availableDaysPerWeek: 5
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/Pharmacist/${user?.id}`);
      setProfile(res.data);
      setFormData({
        fullName: res.data.fullName || '',
        phone: res.data.phoneNumber || '',
        street: res.data.street || '',
        houseNumber: res.data.houseNumber || '',
        postalCode: res.data.postalCode || '',
        city: res.data.city || '',
        maxDistanceKm: res.data.maxDistanceKm || 50,
        availableDaysPerWeek: res.data.availableDaysPerWeek || 5
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await api.put(`/Pharmacist/${user?.id}/profile`, formData);
      showMessage('Profil erfolgreich aktualisiert!', 'success');
      fetchProfile();
    } catch (err: any) {
      showMessage(err.response?.data?.message || 'Fehler beim Speichern des Profils.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'approbation' | 'cv' | 'profilePicture') => {
    setIsUploading(true);
    const form = new FormData();
    form.append(type, file);
    
    try {
      await api.post(`/Pharmacist/${user?.id}/upload-documents`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      showMessage(`${type === 'approbation' ? 'Approbationsurkunde' : (type === 'cv' ? 'Lebenslauf' : 'Profilbild')} erfolgreich hochgeladen.`, 'success');
      fetchProfile();
    } catch (err: any) {
      showMessage(err.response?.data?.message || 'Fehler beim Hochladen.', 'error');
    } finally {
      setIsUploading(false);
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
    <div className="p-6 max-w-4xl mx-auto">
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3 transition-all ${
          message.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-900' : 'bg-red-500/20 border-red-500/30 text-red-900'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 mb-2">Mein Profil</h1>
        <p className="text-slate-600">Verwalte deine persönlichen Daten, Dokumente und Einsatzeinstellungen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6 relative group">
              {profile?.profilePicturePath ? (
                <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-2 border-slate-200">
                  <img src={`${process.env.NEXT_PUBLIC_API_URL || '/api'}/Pharmacist/${profile.id}/document/profile`} alt={profile?.fullName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center text-3xl font-bold text-cyan-700 mb-4 shadow-inner">
                  {profile?.fullName?.substring(0, 2).toUpperCase() || 'PH'}
                </div>
              )}
              <input 
                type="file" 
                ref={profilePicInputRef} 
                className="hidden" 
                accept=".jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'profilePicture')} 
              />
              <button 
                type="button"
                onClick={() => profilePicInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-16 right-1/2 translate-x-12 bg-white border border-slate-200 p-1.5 rounded-full shadow-md text-slate-500 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Profilbild ändern"
              >
                <UploadCloud className="w-4 h-4" />
              </button>
              
              <h2 className="text-xl font-bold text-slate-900">{profile?.fullName}</h2>
              <p className="text-slate-500">{profile?.qualification || 'Apotheker'}</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-900 truncate w-32 text-right">{profile?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Konto-Status</span>
                {profile?.isVerified ? (
                  <span className="inline-flex items-center text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Verifiziert
                  </span>
                ) : (
                  <span className="inline-flex items-center text-amber-600 font-medium">
                    <AlertCircle className="w-4 h-4 mr-1" /> Ausstehend
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-cyan-600" /> Dokumente
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-slate-800">Approbationsurkunde</p>
                  {profile?.hasApprobation && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <input 
                  type="file" 
                  ref={approbationInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'approbation')} 
                />
                <button 
                  type="button" 
                  onClick={() => approbationInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  {profile?.hasApprobation ? 'Neu hochladen' : 'Hochladen'}
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-slate-800">Lebenslauf (CV)</p>
                  {profile?.cvDocumentPath && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <input 
                  type="file" 
                  ref={cvInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'cv')} 
                />
                <button 
                  type="button" 
                  onClick={() => cvInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  {profile?.cvDocumentPath ? 'Neu hochladen' : 'Hochladen'}
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-start text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-500" />
              <p>Der Upload einer neuen Approbationsurkunde erfordert eine erneute manuelle Verifizierung durch den Administrator.</p>
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Persönliche Informationen</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Vollständiger Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="pl-10 w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Telefonnummer</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="pl-10 w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        required
                        placeholder="Straße"
                        value={formData.street}
                        onChange={e => setFormData({...formData, street: e.target.value})}
                        className="pl-10 w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-1">
                      <input 
                        type="text" 
                        required
                        placeholder="Nr."
                        value={formData.houseNumber}
                        onChange={e => setFormData({...formData, houseNumber: e.target.value})}
                        className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <input 
                        type="text" 
                        required
                        placeholder="PLZ"
                        value={formData.postalCode}
                        onChange={e => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Stadt"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Einsatzpräferenzen</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Max. Einsatzradius (km)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="500"
                        value={formData.maxDistanceKm}
                        onChange={e => setFormData({...formData, maxDistanceKm: parseInt(e.target.value) || 0})}
                        className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Verfügbare Tage / Woche</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="7"
                        value={formData.availableDaysPerWeek}
                        onChange={e => setFormData({...formData, availableDaysPerWeek: parseInt(e.target.value) || 0})}
                        className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="py-3 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    Profil aktualisieren
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
