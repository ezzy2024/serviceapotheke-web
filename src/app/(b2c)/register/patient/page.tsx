'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';

export default function B2CRegisterPage() {
  const [agreedToWaiver, setAgreedToWaiver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToWaiver) return;
    
    setIsSubmitting(true);
    // Mock registration submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to a dashboard or success route
      router.push('/dashboard/patient'); // Assuming this route exists or they see a generic success
    }, 1500);
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-8 bg-bone border-4 border-ink shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="text-3xl font-black text-ink uppercase tracking-tight mb-8">Patienten-Registrierung</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-4">
          <label className="flex items-start gap-4 p-5 bg-white border-2 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 border-2 border-ink text-ink focus:ring-ink rounded-none bg-white"
              checked={agreedToWaiver}
              onChange={(e) => setAgreedToWaiver(e.target.checked)}
              required 
            />
            <span className="text-sm font-bold text-ink">
              <strong className="block text-base uppercase mb-1">Verzicht auf das Widerrufsrecht ( 327 BGB)</strong> 
              Ich stimme ausdrcklich zu, dass Sie vor Ablauf der Widerrufsfrist mit der Ausfhrung des Vertrages beginnen. Mir ist bekannt, dass ich durch diese Zustimmung mit Beginn der Ausfhrung des Vertrages mein Widerrufsrecht verliere.
            </span>
          </label>
        </div>
        
        <button 
          type="submit"
          disabled={!agreedToWaiver || isSubmitting}
          className="w-full py-4 bg-blue-600 border-2 border-ink text-white text-lg font-black uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
            <>
              Kostenpflichtig Registrieren <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
