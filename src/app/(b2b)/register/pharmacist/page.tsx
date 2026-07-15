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

      toast.success('E-Mail bestätigt und Registrierung abgeschlossen!');
      window.location.href = '/dashboard/pharmacist';
    } catch (err: any) {
      const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Ein Fehler ist aufgetreten.');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bone flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-ink font-bricolage tracking-tight uppercase">Apotheker Registrierung</h2>
          <p className="mt-4 text-ink/70 font-medium font-jetbrains uppercase tracking-widest text-sm">Schritt {step} von {step === 4 ? 4 : 3}</p>
        </div>

        <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(12,20,16,1)] p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage uppercase tracking-tight">Persönliche Daten & Account</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Vorname</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.firstName ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                    {errors.firstName && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Nachname</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.lastName ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                    {errors.lastName && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">E-Mail Adresse</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.email ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                    {errors.email && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Passwort</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.password ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.password && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Passwort bestätigen</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.confirmPassword ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.confirmPassword && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Straße</label>
                      <input type="text" name="street" value={formData.street} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.street ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.street && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Hausnummer</label>
                      <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.houseNumber ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.houseNumber && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.houseNumber}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">PLZ</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.postalCode ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.postalCode && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.postalCode}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Stadt</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`block w-full p-3 border-4 focus:outline-none focus:bg-lime/10 transition-colors ${errors.city ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.city && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.city}</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <Button onClick={handleNext} variant="brutalist">
                    Weiter <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage uppercase tracking-tight">Qualifikationen & Kenntnisse</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Warenwirtschaftssysteme (WWS)</label>
                    <div className="flex gap-2">
                      <select value={currentWws} onChange={(e) => setCurrentWws(e.target.value)} className="block w-full p-3 border-4 border-ink focus:outline-none focus:bg-lime/10 transition-colors font-bold bg-white">
                        <option>Pharmatechnik IXOS</option>
                        <option>CGM Lauer</option>
                        <option>ADG</option>
                        <option>Awinta</option>
                      </select>
                      <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className="block w-full p-3 border-4 border-ink focus:outline-none focus:bg-lime/10 transition-colors font-bold bg-white">
                        <option>Grundkenntnisse</option>
                        <option>Fortgeschritten</option>
                        <option>Experte</option>
                      </select>
                      <Button onClick={addWws} variant="brutalist-secondary" size="md">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {selectedWwsList.map((wws, idx) => (
                        <span key={idx} className="inline-flex items-center gap-2 bg-lime border-2 border-ink text-ink px-4 py-2 text-sm font-bold uppercase tracking-wide">
                          {wws.system} ({wws.level})
                          <button onClick={() => removeWws(wws.system)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-between">
                  <Button onClick={() => setStep(1)} variant="brutalist-secondary">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Zurück
                  </Button>
                  <Button onClick={handleNext} variant="brutalist">
                    Weiter <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage uppercase tracking-tight">Dokumente Upload</h3>
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
                  <Button onClick={() => setStep(2)} variant="brutalist-secondary">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Zurück
                  </Button>
                  <Button onClick={handleSubmit} isLoading={isLoading} variant="brutalist">
                    <CheckCircle2 className="mr-2 w-5 h-5" /> Registrierung abschließen
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage uppercase tracking-tight">E-Mail Besttigung</h3>
                <div className="space-y-6">
                  <p className="text-ink font-medium">Wir haben einen Code an <strong className="bg-lime px-1">{formData.email}</strong> gesendet. Bitte gib den Code hier ein.</p>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Besttigungscode</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full p-4 border-4 border-ink focus:outline-none focus:bg-lime/10 transition-colors text-center text-3xl tracking-[0.5em] font-jetbrains font-bold" placeholder="123456" />
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <Button onClick={handleVerify} isLoading={isLoading} variant="brutalist">
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
