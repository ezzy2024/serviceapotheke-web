'use client';

import { useState } from 'react';

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
    softwareSystem: 'CGM Lauer',
    softwareSystemOther: ''
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
        if (key === 'softwareSystemOther') return;
        if (key === 'softwareSystem' && formData.softwareSystem === 'Andere') {
          submitData.append(key, formData.softwareSystemOther);
          return;
        }
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
          toast.info('Bitte bestätigen Sie Ihre E-Mail-Adresse.');
          return;
        }
        throw loginErr;
      }

      toast.success('Registrierung erfolgreich!');
      window.location.href = '/dashboard/pharmacy';

    } catch (err: any) {
      if (err.errors) {
        toast.error(err.errors[0].message);
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        toast.error(firstError[0]);
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
      await api.post('/Pharmacy/confirm-email', { email: formData.email, token: otp });
      await api.post('/Pharmacy/login', { email: formData.email, password: formData.password });
      
      toast.success('E-Mail bestätigt und Registrierung abgeschlossen!');
      window.location.href = '/dashboard/pharmacy';
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Apotheken Registrierung</h2>
          <p className="mt-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">Schritt {step} von {step === 4 ? 4 : 3}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
            {step === 1 && (
              <div key="step1">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Apotheken Daten & Account</h3>
                  <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name der Apotheke</label>
                    <input type="text" name="pharmacyName" value={formData.pharmacyName} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.pharmacyName ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                    {errors.pharmacyName && <p className="mt-2 text-sm text-red-600 font-medium">{errors.pharmacyName}</p>}
                  </div>
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
              </div>
            )}

            {step === 2 && (
              <div key="step2">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Infrastruktur & Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Betriebserlaubnis Nummer / IK-Nummer</label>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Eingesetztes Warenwirtschaftssystem</label>
                    <select name="softwareSystem" value={formData.softwareSystem} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                      <option>CGM Lauer</option>
                      <option>Pharmatechnik IXOS</option>
                      <option>ADG</option>
                      <option>Awinta</option>
                      <option>Prokas</option>
                      <option>Andere</option>
                    </select>
                    {formData.softwareSystem === 'Andere' && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Bitte WWS angeben</label>
                        <input type="text" name="softwareSystemOther" value={formData.softwareSystemOther} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Name des Systems" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Apotheken Beschreibung (optional)</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"></textarea>
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
              </div>
            )}

            {step === 3 && (
              <div key="step3">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Verifizierung Dokument</h3>
                <div className="space-y-6">
                  <FileUpload 
                    label="Betriebserlaubnis (erforderlich)" 
                    accept="application/pdf, image/jpeg, image/png" 
                    maxSize={5 * 1024 * 1024} 
                    onFileSelect={(f) => setDocumentFile(f)} 
                    required={true}
                  />
                </div>
                <div className="mt-10 flex justify-between">
                  <Button onClick={() => setStep(2)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Zurück
                  </Button>
                  <Button onClick={handleRegister} isLoading={isLoading} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">
                    <CheckCircle2 className="mr-2 w-5 h-5" /> Registrierung abschließen
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div key="step4">
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
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
