'use client';

import React, { useEffect, useState } from 'react';
import { useIdentificationStore } from '@/store/useIdentificationStore';
import { trackConversion } from '@/lib/tracking';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { setWorkflow } = useIdentificationStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'pharmacy' // 'pharmacy' or 'pharmacist'
  });

  useEffect(() => {
    setIsHydrated(true);
    // Track page view
    trackConversion('onboarding_page_viewed');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion('registration_form_submitted', { role: formData.role });
    
    // Simulate immediate routing (Zero-Instruction fluidity)
    if (formData.role === 'pharmacy') {
      setWorkflow('PHARMACY_REGISTRATION');
      router.push('/register/pharmacy');
    } else {
      setWorkflow('PHARMACY_REGISTRATION'); // Assuming Pharmacist uses the same sub-flow or different route
      router.push('/register/pharmacist');
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full glass-card p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-blue-600/30">
            S
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kostenlos starten
          </h1>
          <p className="text-slate-500 mt-2">
            Richten Sie Ihr ServiceApotheke-Konto in weniger als einer Minute ein.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Vollständiger Name</label>
            <input 
              type="text" 
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white/50" 
              placeholder="Dr. Max Mustermann" 
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">E-Mail Adresse</label>
            <input 
              type="email" 
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white/50" 
              placeholder="max@apotheke.de" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ich bin ein...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'pharmacy'})}
                className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${formData.role === 'pharmacy' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
              >
                Apotheken-<br/>Betreiber
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'pharmacist'})}
                className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${formData.role === 'pharmacist' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
              >
                Apotheker /<br/>PTA
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary-cta w-full text-lg mt-4 flex items-center justify-center gap-2"
          >
            Jetzt registrieren
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <p className="text-center text-sm text-slate-500">
            Mit der Registrierung akzeptieren Sie unsere AGB und Datenschutzbestimmungen.
          </p>
        </form>
      </div>
    </div>
  );
}
