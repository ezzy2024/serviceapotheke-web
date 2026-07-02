'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function PharmacistWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    maxDistanceKm: 50,
  });
  
  const [file, setFile] = useState<File | null>(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Register base account
      await api.post('/Pharmacist/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      // 2. Login to get cookie
      const loginRes = await api.post('/Pharmacist/login', {
        email: formData.email,
        password: formData.password,
      });
      
      const userId = loginRes.data.id;

      // 3. Upload Approbation and Geodata
      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        await api.post(`/Pharmacist/${userId}/upload-approbation`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      await api.put(`/Pharmacist/${userId}/profile`, {
        maxDistanceKm: formData.maxDistanceKm,
      });

      // Done! Redirect to dashboard
      router.push('/dashboard/pharmacist');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrierung fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-2xl z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800">Apotheker Registrierung</h2>
            <p className="text-slate-500 mt-2">Schritt {step} von 3</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Stammdaten</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Vollständiger Name</label>
                      <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Passwort</label>
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Adresse & Einsatzradius</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Vollständige Adresse (für Geocoding)</label>
                      <input type="text" placeholder="Musterstraße 1, 12345 Berlin" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Maximaler Einsatzradius (km)</label>
                      <input type="range" min="5" max="200" value={formData.maxDistanceKm} onChange={e => setFormData({...formData, maxDistanceKm: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      <div className="text-indigo-600 font-bold mt-2">{formData.maxDistanceKm} km</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Approbationsurkunde</h3>
                  <p className="text-sm text-slate-500 mb-4">Für die Freischaltung deines Profils benötigen wir einen Nachweis deiner Approbation.</p>
                  
                  <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Datei auswählen</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                        </label>
                        <p className="pl-1">oder Drag & Drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500 mt-2">PDF, PNG, JPG bis zu 10MB</p>
                    </div>
                  </div>
                  {file && (
                    <div className="flex items-center text-sm text-green-600 font-medium mt-4">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> {file.name} ausgewählt
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
            <button
              onClick={prevStep}
              disabled={step === 1 || isLoading}
              className={`flex items-center px-6 py-3 rounded-xl font-medium ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Zurück
            </button>

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Weiter <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isLoading || !file}
                className="flex items-center px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Lädt...' : 'Registrierung abschließen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
