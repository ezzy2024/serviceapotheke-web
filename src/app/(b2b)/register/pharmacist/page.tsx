'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, Plus, X } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { pharmacistSchema } from '@/lib/validation';

export default function PharmacistWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
  const [currentLevel, setCurrentLevel] = useState('Grundkenntnisse');

  // File Upload State
  const [approbationFile, setApprobationFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [otp, setOtp] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step === 1) {
      try {
        await pharmacistSchema.parseAsync(formData);
        setErrors({});
        setStep(2);
      } catch (err: any) {
        const newErrors: Record<string, string> = {};
        if (err.errors) {
          err.errors.forEach((e: any) => {
            if (e.path && e.path.length > 0) {
              newErrors[e.path[0]] = e.message;
            }
          });
        }
        setErrors(newErrors);
        toast.error('Bitte überprüfen Sie Ihre Eingaben in den markierten Feldern.');
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const addWws = () => {
    if (!selectedWwsList.find(w => w.system === currentWws)) {
      setSelectedWwsList([...selectedWwsList, { system: currentWws, level: currentLevel }]);
    }
  };

  const removeWws = (sys: string) => {
    setSelectedWwsList(selectedWwsList.filter(w => w.system !== sys));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Validate full payload
      await pharmacistSchema.parseAsync(formData);

      // 2. Register
      await api.post('/Pharmacist/register', {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        houseNumber: formData.houseNumber,
        postalCode: formData.postalCode,
        city: formData.city,
        qualification: formData.qualification,
        wwsProficiency: selectedWwsList.length > 0 
          ? selectedWwsList.map(w => `${w.system}: ${w.level}`).join(', ') 
          : `${currentWws}: ${currentLevel}`
      });

      // 3. Login
      let userId;
      try {
        const loginRes = await api.post('/Pharmacist/login', {
          email: formData.email,
          password: formData.password,
        });
        userId = loginRes.data.id;
        
        if (loginRes.data.token) {
          localStorage.setItem('token', loginRes.data.token);
          document.cookie = `sa_auth_v2=${loginRes.data.token}; path=/; max-age=28800; secure; samesite=lax`;
        }
      } catch (loginErr: any) {
        if (loginErr.response?.status === 401 && loginErr.response?.data?.message?.includes('E-Mail-Adresse')) {
          setStep(4);
          setIsLoading(false);
          toast.info('Bitte bestätigen Sie Ihre E-Mail-Adresse.');
          return;
        }
        throw loginErr;
      }

      // 4. Upload Docs if exist
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

      toast.success('Registrierung erfolgreich!');
      window.location.href = '/dashboard/pharmacist';

    } catch (err: any) {
      if (err.errors) {
        toast.error(err.errors[0].message);
      } else {
        let msg = 'Ein Fehler ist aufgetreten.';
        if (typeof err.response?.data?.message === 'string' && err.response.data.message.trim() !== '') {
          msg = err.response.data.message;
        } else if (typeof err.response?.data?.title === 'string' && err.response.data.title.trim() !== '') {
          msg = err.response.data.title;
        } else if (typeof err.response?.data?.detail === 'string' && err.response.data.detail.trim() !== '') {
          msg = err.response.data.detail;
        } else if (typeof err.response?.data === 'string' && err.response.data.trim() !== '') {
          msg = err.response.data;
        }
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await api.post('/Pharmacist/confirm-email', { email: formData.email, token: otp });
      const loginRes = await api.post('/Pharmacist/login', { email: formData.email, password: formData.password });
      const userId = loginRes.data.id;
      
      if (loginRes.data.token) {
        localStorage.setItem('token', loginRes.data.token);
        document.cookie = `sa_auth_v2=${loginRes.data.token}; path=/; max-age=28800; secure; samesite=lax`;
      }

      if (approbationFile || cvFile || profilePicFile) {
        const fileData = new FormData();
        if (approbationFile) fileData.append('approbation', approbationFile);
        if (cvFile) fileData.append('cv', cvFile);
        if (profilePicFile) fileData.append('profilePicture', profilePicFile);
        await api.post(`/Pharmacist/${userId}/upload-documents`, fileData);
      }

      await api.put(`/Pharmacist/${userId}/profile`, { maxDistanceKm: formData.maxDistanceKm });

      toast.success('E-Mail bestätigt und Registrierung abgeschlossen!');
      window.location.href = '/dashboard/pharmacist';
    } catch (err: any) {
      let msg = 'Ein Fehler ist aufgetreten.';
      if (typeof err.response?.data?.message === 'string' && err.response.data.message.trim() !== '') {
        msg = err.response.data.message;
      } else if (typeof err.response?.data?.title === 'string' && err.response.data.title.trim() !== '') {
        msg = err.response.data.title;
      } else if (typeof err.response?.data?.detail === 'string' && err.response.data.detail.trim() !== '') {
        msg = err.response.data.detail;
      } else if (typeof err.response?.data === 'string' && err.response.data.trim() !== '') {
        msg = err.response.data;
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Apotheker Registrierung</h2>
          <p className="mt-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">Schritt {step} von {step === 4 ? 4 : 3}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Persönliche Daten & Account</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Vorname</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.firstName ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                    {errors.firstName && <p className="mt-2 text-sm text-red-600 font-medium">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nachname</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.lastName ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                    {errors.lastName && <p className="mt-2 text-sm text-red-600 font-medium">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">E-Mail Adresse</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.email ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                    {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Passwort</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.password ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                      {errors.password && <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Passwort bestätigen</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.confirmPassword ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                      {errors.confirmPassword && <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Straße</label>
                      <input type="text" name="street" value={formData.street} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.street ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                      {errors.street && <p className="mt-2 text-sm text-red-600 font-medium">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Hausnummer</label>
                      <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.houseNumber ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                      {errors.houseNumber && <p className="mt-2 text-sm text-red-600 font-medium">{errors.houseNumber}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">PLZ</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.postalCode ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                      {errors.postalCode && <p className="mt-2 text-sm text-red-600 font-medium">{errors.postalCode}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Stadt</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.city ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                      {errors.city && <p className="mt-2 text-sm text-red-600 font-medium">{errors.city}</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <Button onClick={handleNext} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    Weiter <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Qualifikationen & Kenntnisse</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Warenwirtschaftssysteme (WWS)</label>
                    <div className="flex gap-2">
                      <select value={currentWws} onChange={(e) => setCurrentWws(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                        <option>Pharmatechnik IXOS</option>
                        <option>CGM Lauer</option>
                        <option>ADG</option>
                        <option>Awinta</option>
                      </select>
                      <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                        <option>Grundkenntnisse</option>
                        <option>Fortgeschritten</option>
                        <option>Experte</option>
                      </select>
                      <Button onClick={addWws} className="bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:text-slate-900 font-semibold px-4 py-3 transition-all inline-flex items-center justify-center" size="md">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {selectedWwsList.map((wws, idx) => (
                        <span key={idx} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg px-4 py-2 text-sm font-semibold">
                          {wws.system} ({wws.level})
                          <button onClick={() => removeWws(wws.system)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-between">
                  <Button onClick={() => setStep(1)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Zurück
                  </Button>
                  <Button onClick={handleNext} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    Weiter <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Dokumente Upload</h3>
                <div className="space-y-6">
                  <FileUpload 
                    label="Approbationsurkunde" 
                    accept="application/pdf, image/jpeg, image/png" 
                    maxSize={10 * 1024 * 1024} 
                    onFileSelect={(f) => setApprobationFile(f)} 
                  />
                  <FileUpload 
                    label="Lebenslauf (optional)" 
                    accept="application/pdf" 
                    maxSize={5 * 1024 * 1024} 
                    onFileSelect={(f) => setCvFile(f)} 
                  />
                  <FileUpload 
                    label="Profilbild (optional)" 
                    accept="image/jpeg, image/png" 
                    maxSize={5 * 1024 * 1024} 
                    onFileSelect={(f) => setProfilePicFile(f)} 
                  />
                </div>
                <div className="mt-10 flex justify-between">
                  <Button onClick={() => setStep(2)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Zurück
                  </Button>
                  <Button onClick={handleSubmit} isLoading={isLoading} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    <CheckCircle2 className="mr-2 w-5 h-5" /> Registrierung abschließen
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">E-Mail Bestätigung</h3>
                <div className="space-y-6">
                  <p className="text-slate-600 font-medium">Wir haben einen Code an <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">{formData.email}</strong> gesendet. Bitte gib den Code hier ein.</p>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Bestätigungscode</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-3xl tracking-[0.5em] font-mono font-bold" placeholder="123456" />
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <Button onClick={handleVerify} isLoading={isLoading} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    Verifizieren <CheckCircle2 className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
