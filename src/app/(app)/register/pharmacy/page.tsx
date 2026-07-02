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
    address: '',
    licenseNumber: '',
    pdlManagement: false,
    emergencyMatching: false,
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Register base account
      await api.post('/Pharmacy/register', formData);

      // 2. Login to get cookie
      await api.post('/Pharmacy/login', {
        email: formData.email,
        password: formData.password,
      });

      // Done! Redirect to dashboard (hard reload to trigger AuthContext fetch)
      window.location.href = '/dashboard/pharmacy';

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
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Adresse (inkl. PLZ/Ort)</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 placeholder:text-slate-400" required />
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
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600">PDF, JPG oder PNG (max. 5MB)</p>
                      <button className="mt-3 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200">Datei auswählen</button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <div className="flex-shrink-0 mt-1">
                        <input type="checkbox" checked={formData.pdlManagement} onChange={e => setFormData({...formData, pdlManagement: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors">pDL-Management aktivieren</span>
                        <span className="block text-xs text-slate-500">Automatisierte Dokumentation von Pharmazeutischen Dienstleistungen.</span>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <div className="flex-shrink-0 mt-1">
                        <input type="checkbox" checked={formData.emergencyMatching} onChange={e => setFormData({...formData, emergencyMatching: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors">Personal-Matching für Notdienste</span>
                        <span className="block text-xs text-slate-500">Erhalte priorisierte Vorschläge für Wochenend- und Nachtschichten.</span>
                      </div>
                    </label>
                  </div>
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
        </div>
      </div>
    </div>
  );
}
