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
import { searchPharmacyRegistry } from '@/app/actions/searchPharmacyRegistry';

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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showManualFields, setShowManualFields] = useState(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      setIsSearching(true);
      const results = await searchPharmacyRegistry(query);
      setSearchResults(results || []);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPharmacy = (pharmacy: any) => {
    setFormData((prev) => ({
      ...prev,
      pharmacyName: pharmacy.name || '',
      street: pharmacy.street || '',
      postalCode: pharmacy.plz || '',
      city: pharmacy.city || ''
    }));
    setSearchQuery(pharmacy.name || '');
    setSearchResults([]);
    setShowManualFields(true);
  };

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
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        toast.error(firstError[0]);
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
      
      toast.success('E-Mail bestätigt und Registrierung abgeschlossen!');
      window.location.href = '/dashboard/pharmacy';
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
          <h2 className="text-4xl md:text-5xl font-black text-ink font-bricolage tracking-tight uppercase">Apotheken Registrierung</h2>
          <p className="mt-4 text-ink/70 font-medium font-jetbrains uppercase tracking-widest text-sm">Schritt {step} von {step === 4 ? 4 : 3}</p>
        </div>

        <div className="bg-white border-2 border-ink shadow-[8px_8px_0px_0px_rgba(12,20,16,1)] p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage tracking-tight">Apotheken Daten & Account</h3>
                
                <div className="mb-8 relative">
                  <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Apotheken-Register durchsuchen</label>
                  <input 
                    type="text" 
                    placeholder="Suchen Sie Ihre Apotheke nach Name oder PLZ..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full p-3 border-2 border-lime focus:outline-none focus:bg-lime/10 transition-colors bg-white shadow-[4px_4px_0px_0px_rgba(12,20,16,1)]"
                  />
                  {isSearching && <div className="absolute right-3 top-10 text-sm font-bold text-ink/50">Lade...</div>}
                  {searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] p-4 text-center">
                      <p className="text-sm font-bold text-ink mb-3">Keine Apotheke gefunden?</p>
                      <Button onClick={() => setShowManualFields(true)} variant="brutalist-secondary" className="w-full">
                        Manuell eintragen
                      </Button>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <ul className="absolute z-10 w-full mt-2 bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] max-h-60 overflow-y-auto">
                      {searchResults.map((p) => (
                        <li 
                          key={p.id} 
                          onClick={() => handleSelectPharmacy(p)}
                          className="p-3 border-b-2 border-ink/10 hover:bg-lime/20 cursor-pointer transition-colors"
                        >
                          <div className="font-bold text-ink">{p.name}</div>
                          <div className="text-xs text-ink/70">{p.street}, {p.plz} {p.city}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {showManualFields && (
                  <>
                  <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Name der Apotheke</label>
                    <input type="text" name="pharmacyName" value={formData.pharmacyName} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.pharmacyName ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                    {errors.pharmacyName && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.pharmacyName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">E-Mail Adresse</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.email ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                    {errors.email && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Passwort</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.password ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.password && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Passwort besttigen</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.confirmPassword ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.confirmPassword && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Strae</label>
                      <input type="text" name="street" value={formData.street} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.street ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.street && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Hausnummer</label>
                      <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.houseNumber ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.houseNumber && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.houseNumber}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">PLZ</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.postalCode ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.postalCode && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.postalCode}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Stadt</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime/10 transition-colors ${errors.city ? 'border-persimmon bg-persimmon/10' : 'border-ink'}`} />
                      {errors.city && <p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">{errors.city}</p>}
                    </div>
                  </div>
                </div>
                  <div className="mt-10 flex justify-end">
                    <Button onClick={handleNext} variant="brutalist">
                      Weiter <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                  </>
                  )}
                </motion.div>
              )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage tracking-tight">Infrastruktur & Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Betriebserlaubnis Nummer / IK-Nummer</label>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} className="block w-full p-3 border-2 border-ink focus:outline-none focus:bg-lime/10 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Eingesetztes Warenwirtschaftssystem</label>
                    <select name="softwareSystem" value={formData.softwareSystem} onChange={handleInputChange} className="block w-full p-3 border-2 border-ink focus:outline-none focus:bg-lime/10 transition-colors bg-white font-bold">
                      <option>CGM Lauer</option>
                      <option>Pharmatechnik IXOS</option>
                      <option>ADG</option>
                      <option>Awinta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Apotheken Beschreibung (optional)</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="block w-full p-3 border-2 border-ink focus:outline-none focus:bg-lime/10 transition-colors resize-none"></textarea>
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
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage tracking-tight">Verifizierung Dokument</h3>
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
                  <Button onClick={() => setStep(2)} variant="brutalist-secondary">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Zurück
                  </Button>
                  <Button onClick={handleRegister} isLoading={isLoading} variant="brutalist">
                    <CheckCircle2 className="mr-2 w-5 h-5" /> Registrierung abschließen
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-ink mb-6 font-bricolage tracking-tight">E-Mail Bestätigung</h3>
                <div className="space-y-6">
                  <p className="text-ink font-medium">Wir haben einen Code an <strong className="bg-lime px-1">{formData.email}</strong> gesendet. Bitte gib den Code hier ein.</p>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">Bestätigungscode</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full p-4 border-2 border-ink focus:outline-none focus:bg-lime/10 transition-colors text-center text-3xl tracking-[0.5em] font-jetbrains font-bold" placeholder="123456" />
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
