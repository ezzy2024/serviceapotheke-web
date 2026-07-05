'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ShieldCheck, FileText, UploadCloud } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function PharmacyWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    pharmacyName: '',
    email: '',
    password: '',
    phoneNumber: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    licenseNumber: '',
    description: '',
    documentName: '',
    softwareSystem: '',
    documentFile: null as File | null,
  });

  const [otp, setOtp] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Register base account
      let utmData = {};
      try {
        const storedUtm = sessionStorage.getItem("utm_data");
        if (storedUtm) utmData = JSON.parse(storedUtm);
      } catch(e) {}

      await api.post('/Pharmacy/register', { ...formData, ...utmData });

      // 2. Try to login
      let pharmacyId = null;
      try {
        const loginRes = await api.post('/Pharmacy/login', {
          email: formData.email,
          password: formData.password,
        });
        pharmacyId = loginRes.data.id;
      } catch (loginErr: any) {
        if (loginErr.response?.status === 401 && loginErr.response?.data?.message?.includes('E-Mail-Adresse')) {
          setStep(4);
          setIsLoading(false);
          return;
        }
        throw loginErr;
      }

      // 3. Upload Document
      if (pharmacyId && formData.documentFile) {
        const docData = new FormData();
        docData.append('license', formData.documentFile);
        try {
          await api.post(`/Document/pharmacy/${pharmacyId}`, docData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (uploadErr) {
          console.error('Failed to upload document', uploadErr);
        }
      }

      window.location.href = '/dashboard/pharmacy';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrierung fehlgeschlagen.');
    } finally {
      setIsLoading(false);
      sessionStorage.removeItem("utm_data");
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/Pharmacy/confirm-email', { email: formData.email, token: otp });
      await api.post('/Pharmacy/login', { email: formData.email, password: formData.password });
      window.location.href = '/dashboard/pharmacy';
    } catch (err: any) {
      setError(err.response?.data || 'Ungültiger Code.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-2xl z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800">Apotheken Registrierung</h2>
            <p className="text-slate-500 mt-2">Schritt {step} von 3</p>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
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
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Apotheken-Informationen</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name der Apotheke</label>
                      <input type="text" value={formData.pharmacyName} onChange={e => setFormData({...formData, pharmacyName: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Straße</label>
                      <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hausnummer</label>
                      <input type="text" value={formData.houseNumber} onChange={e => setFormData({...formData, houseNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">PLZ</label>
                      <input type="text" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ort</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Kontakt-E-Mail</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Passwort</label>
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
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
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <ShieldCheck className="w-6 h-6 mr-2 text-teal-600" /> Betriebserlaubnis
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Bitte gib die Nummer deiner apothekenrechtlichen Betriebserlaubnis ein, um deinen Status als Apotheke zu verifizieren.</p>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nummer der Betriebserlaubnis</label>
                    <input type="text" placeholder="z.B. BE-12345-67" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-teal-600" /> Profil & Dokumente
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Apothekenerlaubnis hochladen</label>
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer block relative">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({...formData, documentName: file.name, documentFile: file});
                        }}
                      />
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600">
                        {formData.documentName ? (
                          <span className="font-bold text-teal-600">{formData.documentName} ausgewählt</span>
                        ) : (
                          "PDF, JPG oder PNG (max. 5MB)"
                        )}
                      </p>
                      {!formData.documentName && (
                        <div className="mt-3 inline-block px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200">
                          Datei auswählen
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Verwendetes Warenwirtschaftssystem (WWS)</label>
                    <select 
                      value={formData.softwareSystem === 'Sonstiges' || !['', 'CGM Lauer', 'ADG', 'Pharmatechnik', 'Aposoft', 'Noventi'].includes(formData.softwareSystem) && formData.softwareSystem !== '' ? 'Sonstiges' : formData.softwareSystem} 
                      onChange={e => setFormData({...formData, softwareSystem: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 mb-2" 
                      required
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="CGM Lauer">CGM Lauer</option>
                      <option value="ADG">ADG</option>
                      <option value="Pharmatechnik">Pharmatechnik (IXOS)</option>
                      <option value="Aposoft">Aposoft</option>
                      <option value="Noventi">Noventi (Awinta)</option>
                      <option value="Sonstiges">Sonstiges</option>
                    </select>

                    {(formData.softwareSystem === 'Sonstiges' || (!['', 'CGM Lauer', 'ADG', 'Pharmatechnik', 'Aposoft', 'Noventi'].includes(formData.softwareSystem) && formData.softwareSystem !== '')) && (
                      <input 
                        type="text" 
                        value={formData.softwareSystem === 'Sonstiges' ? '' : formData.softwareSystem}
                        onChange={e => setFormData({...formData, softwareSystem: e.target.value})}
                        placeholder="Welches WWS nutzt du?"
                        className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400 mt-2"
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apotheken-Beschreibung & Weitere Details (Optional)</label>
                    <p className="text-xs text-slate-500 mb-2">Gib potenziellen Vertretern einen kurzen Einblick in deine Apotheke (z.B. Teamgröße, Parkplätze, Kundenstamm).</p>
                    <textarea 
                      rows={4}
                      value={formData.description || ''} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400 resize-none" 
                      placeholder="Wir sind eine lebhafte Center-Apotheke mit einem jungen Team..."
                    />
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
                      className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none text-slate-900 text-center text-3xl tracking-widest font-mono transition-all" 
                    />
                  </div>

                  <button
                    onClick={handleOtpSubmit}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full flex justify-center items-center px-8 py-4 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50"
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
                  className="flex items-center px-6 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                >
                  Weiter <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="flex items-center px-8 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50"
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
