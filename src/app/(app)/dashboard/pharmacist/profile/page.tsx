'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { User, Phone, MapPin, Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Editable fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
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
        address: res.data.address || '',
        maxDistanceKm: res.data.maxDistanceKm || 50,
        availableDaysPerWeek: res.data.availableDaysPerWeek || 5
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await api.put(`/Pharmacist/${user?.id}/profile`, formData);
      setMessage({ text: 'Profil erfolgreich aktualisiert!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Fehler beim Speichern des Profils.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Mein Profil</h1>
        <p className="text-slate-600">Verwalte deine persönlichen Daten, Qualifikationen und Einstellungen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Status Info */}
        <div className="md:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4">
                PH
              </div>
              <h2 className="text-xl font-bold text-slate-900">{profile?.fullName}</h2>
              <p className="text-slate-500">{profile?.qualification}</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-900">{profile?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Konto-Status</span>
                <span className="inline-flex items-center text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Aktiv
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Approbationsdaten
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Qualifikation</p>
                <p className="text-sm font-medium text-slate-900">{profile?.qualification}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">WWS-Kenntnisse</p>
                <p className="text-sm font-medium text-slate-900">{profile?.wwsProficiency}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-500" />
              <p>Diese Daten sind geprüft und können nur über den Support geändert werden.</p>
            </div>
          </motion.div>
        </div>

        {/* Main Edit Form */}
        <div className="md:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Persönliche Informationen</h2>
              
              {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>
                  {message.text}
                </div>
              )}

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
                      className="pl-10 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
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
                        className="pl-10 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        required
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="pl-10 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
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
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
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
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? 'Speichert...' : 'Profil aktualisieren'}
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
