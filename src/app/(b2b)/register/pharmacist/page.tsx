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

  const [otp, setOtp] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step === 1) {
      try {
        await pharmacistSchema.parseAsync(formData);
        setStep(2);
      } catch (err: any) {
        toast.error(err.errors?.[0]?.message || 'Ung�ltige Eingaben in Schritt 1');
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
        wwsProficiency: selectedWwsList.map(w => `${w.system}: ${w.level}`).join(', ') || 'Keine Angabe'
      });

      // 3. Login
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
          toast.info('Bitte best�tigen Sie Ihre E-Mail-Adresse.');
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
        const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Ein Fehler ist aufgetreten.');
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

      if (approbationFile || cvFile || profilePicFile) {
        const fileData = new FormData();
        if (approbationFile) fileData.append('approbation', approbationFile);
        if (cvFile) fileData.append('cv', cvFile);
        if (profilePicFile) fileData.append('profilePicture', profilePicFile);
        await api.post(`/Pharmacist/${userId}/upload-documents`, fileData);
      }

      await api.put(`/Pharmacist/${userId}/profile`, { maxDistanceKm: formData.maxDistanceKm });

      toast.success('E-Mail best�tigt und Registrierung abgeschlossen!');
      window.location.href = '/dashboard/pharmacist';
    } catch (err: any) {
      const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Ein Fehler ist aufgetreten.');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Apotheker Registrierung</h2>
          <p className="mt-2 text-sm text-slate-600">Schritt {step} von {step === 4 ? 4 : 3}</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Pers�nliche Daten & Account</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Vorname</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Nachname</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">E-Mail Adresse</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Passwort</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Passwort best�tigen</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Stra�e</label>
                      <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Hausnummer</label>
                      <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">PLZ</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Stadt</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext} variant="primary">
                    Weiter <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Qualifikationen & Kenntnisse</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Warenwirtschaftssysteme (WWS)</label>
                    <div className="flex gap-2">
                      <select value={currentWws} onChange={(e) => setCurrentWws(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm p-2 border">
                        <option>Pharmatechnik IXOS</option>
                        <option>CGM Lauer</option>
                        <option>ADG</option>
                        <option>Awinta</option>
                      </select>
                      <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm p-2 border">
                        <option>Grundkenntnisse</option>
                        <option>Fortgeschritten</option>
                        <option>Experte</option>
                      </select>
                      <Button onClick={addWws} variant="secondary" size="sm">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedWwsList.map((wws, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                          {wws.system} ({wws.level})
                          <button onClick={() => removeWws(wws.system)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button onClick={() => setStep(1)} variant="secondary">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Zur�ck
                  </Button>
                  <Button onClick={handleNext} variant="primary">
                    Weiter <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Dokumente Upload</h3>
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
                <div className="mt-8 flex justify-between">
                  <Button onClick={() => setStep(2)} variant="secondary">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Zur�ck
                  </Button>
                  <Button onClick={handleSubmit} isLoading={isLoading} variant="primary">
                    <CheckCircle2 className="mr-2 w-4 h-4" /> Registrierung abschlie�en
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-slate-800 mb-6">E-Mail Best�tigung</h3>
                <div className="space-y-4">
                  <p className="text-slate-600">Wir haben einen Code an <strong>{formData.email}</strong> gesendet. Bitte gib den Code hier ein.</p>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Best�tigungscode</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-center text-2xl tracking-widest font-mono" placeholder="123456" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleVerify} isLoading={isLoading} variant="primary">
                    Verifizieren <CheckCircle2 className="ml-2 w-4 h-4" />
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
