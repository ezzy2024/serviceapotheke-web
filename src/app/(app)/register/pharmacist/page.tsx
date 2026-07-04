'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, Plus, X } from 'lucide-react';
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
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    maxDistanceKm: 50,
    qualification: 'Approbation'
  });
  
  const [selectedWwsList, setSelectedWwsList] = useState<{system: string, level: string}[]>([]);
  const [currentWws, setCurrentWws] = useState('Pharmatechnik IXOS');
  const [currentLevel, setCurrentLevel] = useState('Gut');
  const [customSoftware, setCustomSoftware] = useState('');
  
  const [approbationFile, setApprobationFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const handleAddWws = () => {
    const sys = currentWws === 'Andere' ? customSoftware : currentWws;
    if (!sys) return;
    if (selectedWwsList.find(w => w.system === sys)) return;
    setSelectedWwsList([...selectedWwsList, { system: sys, level: currentLevel }]);
    setCustomSoftware('');
    setCurrentWws('Pharmatechnik IXOS');
  };

  const handleRemoveWws = (sys: string) => {
    setSelectedWwsList(selectedWwsList.filter(w => w.system !== sys));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const [otp, setOtp] = useState('');

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
        street: formData.street,
        houseNumber: formData.houseNumber,
        postalCode: formData.postalCode,
        city: formData.city,
        qualification: formData.qualification,
        wwsProficiency: selectedWwsList.map(w => `${w.system}: ${w.level}`).join(', ') || 'Keine Angabe'
      });

      // 2. Try to login
      let userId;
      try {
        const loginRes = await api.post('/Pharmacist/login', {
          email: formData.email,
          password: formData.password,
        });
        userId = loginRes.data.id;
      } catch (loginErr: any) {
        if (loginErr.response?.status === 401 && loginErr.response?.data?.message?.includes('E-Mail-Adresse')) {
          setStep(4);
          setIsLoading(false);
          return;
        }
        throw loginErr;
      }

      // 3. Upload Approbation, CV and Profile Picture
      if (approbationFile || cvFile || profilePicFile) {
        const fileData = new FormData();
        if (approbationFile) fileData.append('approbation', approbationFile);
        if (cvFile) fileData.append('cv', cvFile);
        if (profilePicFile) fileData.append('profilePicture', profilePicFile);
        await api.post(`/Pharmacist/${userId}/upload-documents`, fileData);
      }

      await api.put(`/Pharmacist/${userId}/profile`, {
        maxDistanceKm: formData.maxDistanceKm,
      });

      // Done! Redirect to dashboard (hard reload to trigger AuthContext fetch)
      window.location.href = '/dashboard/pharmacist';

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrierung fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/Pharmacist/confirm-email', { email: formData.email, token: otp });
      const loginRes = await api.post('/Pharmacist/login', { email: formData.email, password: formData.password });
      const userId = loginRes.data.id;

      if (approbationFile || cvFile || profilePicFile) {
        const fileData = new FormData();
        if (approbationFile) fileData.append('approbation', approbationFile);
        if (cvFile) fileData.append('cv', cvFile);
        if (profilePicFile) fileData.append('profilePicture', profilePicFile);
        await api.post(`/Pharmacist/${userId}/upload-documents`, fileData);
      }

      await api.put(`/Pharmacist/${userId}/profile`, { maxDistanceKm: formData.maxDistanceKm });

      window.location.href = '/dashboard/pharmacist';
    } catch (err: any) {
      const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Ein Fehler ist aufgetreten.');
      setError(msg);
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
                      <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Passwort</label>
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" required />
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
                      <label className="block text-sm font-medium text-slate-700 mb-1">Qualifikation</label>
                      <select 
                        value={formData.qualification}
                        onChange={e => setFormData({...formData, qualification: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
                      >
                        <option value="Approbation">Approbierte/r Apotheker/in</option>
                        <option value="PTA">PTA</option>
                        <option value="PKA">PKA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Warenwirtschaftssystem (WWS)</label>
                      <div className="flex flex-col md:flex-row gap-2 mb-2">
                        <select 
                          value={currentWws}
                          onChange={e => setCurrentWws(e.target.value)}
                          className="w-full md:w-1/2 px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                        >
                          <option value="Pharmatechnik IXOS">Pharmatechnik IXOS</option>
                          <option value="CGM Lauer">CGM Lauer</option>
                          <option value="ApothekenSysteme">ApothekenSysteme (ADG)</option>
                          <option value="awinta">awinta</option>
                          <option value="Sanitas">Sanitas</option>
                          <option value="Andere">Andere (Bitte angeben)</option>
                        </select>
                        
                        <select
                          value={currentLevel}
                          onChange={e => setCurrentLevel(e.target.value)}
                          className="w-full md:w-1/3 px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                        >
                          <option value="Grundkenntnisse">Grundkenntnisse</option>
                          <option value="Gut">Gut</option>
                          <option value="Sehr Gut">Sehr Gut</option>
                          <option value="Beherrschen">Beherrschen</option>
                        </select>

                        <button 
                          type="button" 
                          onClick={handleAddWws}
                          className="w-full md:w-auto px-4 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {currentWws === 'Andere' && (
                        <input 
                          type="text" 
                          value={customSoftware}
                          onChange={e => setCustomSoftware(e.target.value)}
                          placeholder="Welches WWS nutzt du?"
                          className="w-full px-4 py-3 mb-2 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      )}

                      {selectedWwsList.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedWwsList.map((wws, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {wws.system} ({wws.level})
                              <button type="button" onClick={() => handleRemoveWws(wws.system)} className="ml-2 text-indigo-400 hover:text-indigo-600">
                                <X className="w-4 h-4" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Vollständige Adresse (für Geocoding)</label>
                      <div className="grid grid-cols-4 gap-4 mb-2">
                        <input type="text" placeholder="Straße" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="col-span-3 px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                        <input type="text" placeholder="Nr." value={formData.houseNumber} onChange={e => setFormData({...formData, houseNumber: e.target.value})} className="col-span-1 px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <input type="text" placeholder="PLZ" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="col-span-1 px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                        <input type="text" placeholder="Stadt" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="col-span-2 px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Maximaler Einsatzradius (km)</label>
                      <input type="range" min="5" max="500" value={formData.maxDistanceKm} onChange={e => setFormData({...formData, maxDistanceKm: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-800">Approbationsurkunde*</h3>
                      <p className="text-sm text-slate-500">Für die Freischaltung deines Profils benötigen wir einen Nachweis deiner Approbation.</p>
                      
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-6 bg-slate-50 hover:bg-slate-100 transition-colors h-40">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 hover:text-indigo-500 text-sm px-3 py-1">
                          <span>Datei auswählen</span>
                          <input type="file" className="sr-only" onChange={e => setApprobationFile(e.target.files ? e.target.files[0] : null)} />
                        </label>
                        <p className="text-xs leading-5 text-slate-500 mt-2">PDF, PNG, JPG (max. 10MB)</p>
                      </div>
                      {approbationFile && (
                        <div className="flex items-center text-sm text-green-600 font-medium truncate max-w-full">
                          <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" /> {approbationFile.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-800">Lebenslauf (Optional)</h3>
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-4 bg-slate-50 hover:bg-slate-100 transition-colors h-24">
                          <label className="relative cursor-pointer font-semibold text-indigo-600 text-sm flex items-center justify-center w-full h-full">
                            <span>{cvFile ? cvFile.name : 'Lebenslauf hochladen'}</span>
                            <input type="file" className="sr-only" onChange={e => setCvFile(e.target.files ? e.target.files[0] : null)} />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-800">Profilbild (Optional)</h3>
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-4 bg-slate-50 hover:bg-slate-100 transition-colors h-24">
                          <label className="relative cursor-pointer font-semibold text-indigo-600 text-sm flex items-center justify-center w-full h-full">
                            <span>{profilePicFile ? profilePicFile.name : 'Profilbild hochladen'}</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={e => setProfilePicFile(e.target.files ? e.target.files[0] : null)} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <h3 className="text-2xl font-bold text-slate-800">E-Mail Adresse bestätigen</h3>
                  <p className="text-slate-600">
                    Wir haben einen 6-stelligen Bestätigungscode an <strong>{formData.email}</strong> gesendet.
                    Bitte gib diesen Code unten ein.
                  </p>
                  
                  <div className="max-w-xs mx-auto">
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder="123456"
                      value={otp} 
                      onChange={e => setOtp(e.target.value)} 
                      className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-900 text-center text-3xl tracking-widest font-mono transition-all" 
                    />
                  </div>

                  <button
                    onClick={handleOtpSubmit}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full flex justify-center items-center px-8 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Lädt...' : 'Konto aktivieren & Einloggen'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 4 && (
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
                  disabled={isLoading || !approbationFile}
                  className="flex items-center px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Lädt...' : 'Registrierung abschließen'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
