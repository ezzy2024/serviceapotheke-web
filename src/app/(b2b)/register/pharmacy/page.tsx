'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { pharmacySchema } from '@/lib/validation';

export default function PharmacyWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const [formData, setFormData] = useState({
    pharmacyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    licenseNumber: '',
    description: '',
    documentName: 'Betriebserlaubnis',
    softwareSystem: 'CGM Lauer'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [otp, setOtp] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step === 1) {
      try {
        await pharmacySchema.parseAsync(formData);
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
        toast.error('Bitte überprüfe deine Eingaben in den markierten Feldern.');
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await pharmacySchema.parseAsync(formData);

      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword' && value) {
          submitData.append(key, value as string);
        }
      });

      if (documentFile) {
        submitData.append('documentFile', documentFile);
      }

      await api.post('/Pharmacy/register', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      let userId;
      try {
        const loginRes = await api.post('/Pharmacy/login', {
          email: formData.email,
          password: formData.password,
        });
        userId = loginRes.data.id;
      } catch (loginErr: any) {
        if (loginErr.response?.status === 401 && loginErr.response?.data?.message?.includes('E-Mail-Adresse')) {
          setStep(4);
          setIsLoading(false);
          toast.info('Bitte besttigen Sie Ihre E-Mail-Adresse.');
          return;
        }
        throw loginErr;
      }

      toast.success('Registrierung erfolgreich!');
      window.location.href = '/dashboard/pharmacy';

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
      await api.post('/Pharmacy/confirm-email', { email: formData.email, token: otp });
      await api.post('/Pharmacy/login', { email: formData.email, password: formData.password });
      
      toast.success('E-Mail besttigt und Registrierung abgeschlossen!');
      window.location.href = '/dashboard/pharmacy';
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
          <h2 className="text-3xl font-extrabold text-slate-900">Apotheken Registrierung</h2>
          <p className="mt-2 text-sm text-slate-600">Schritt {step} von {step === 4 ? 4 : 3}</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Apotheken Daten & Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name der Apotheke</label>
                    <input type="text" name="pharmacyName" value={formData.pharmacyName} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.pharmacyName ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                    {errors.pharmacyName && <p className="mt-1 text-xs text-red-500">{errors.pharmacyName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">E-Mail Adresse</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Passwort</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                      {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Passwort besttigen</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                      {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Strae</label>
                      <input type="text" name="street" value={formData.street} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.street ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                      {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Hausnummer</label>
                      <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.houseNumber ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                      {errors.houseNumber && <p className="mt-1 text-xs text-red-500">{errors.houseNumber}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">PLZ</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.postalCode ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                      {errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Stadt</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 ${errors.city ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
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
                <h3 className="text-xl font-bold text-slate-800 mb-6">Infrastruktur & Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Betriebserlaubnis Nummer / IK-Nummer</label>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Eingesetztes Warenwirtschaftssystem</label>
                    <select name="softwareSystem" value={formData.softwareSystem} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                      <option>CGM Lauer</option>
                      <option>Pharmatechnik IXOS</option>
                      <option>ADG</option>
                      <option>Awinta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Apotheken Beschreibung (optional)</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
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
                <h3 className="text-xl font-bold text-slate-800 mb-6">Verifizierung Dokument</h3>
                <div className="space-y-6">
                  <FileUpload 
                    label="Betriebserlaubnis (erforderlich)" 
                    accept="application/pdf, image/jpeg, image/png" 
                    maxSize={5 * 1024 * 1024} 
                    onFileSelect={(f) => setDocumentFile(f)} 
                    required={true}
                  />
                </div>
                <div className="mt-8 flex justify-between">
                  <Button onClick={() => setStep(2)} variant="secondary">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Zur�ck
                  </Button>
                  <Button onClick={handleRegister} isLoading={isLoading} variant="primary">
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
