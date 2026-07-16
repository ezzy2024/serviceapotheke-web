'use client';
import { useState } from 'react';
import { Building2, User, ArrowRight, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [role, setRole] = useState<'Pharmacist' | 'Pharmacy'>('Pharmacist');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const endpoint = role === 'Pharmacy' ? '/Pharmacy/forgot-password' : '/Pharmacist/forgot-password';
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5241/api';
      
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error('Fehler beim Senden der E-Mail.');
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center text-slate-500 hover:text-slate-700 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Login
        </Link>
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Passwort zurücksetzen</h1>
            <p className="text-slate-500 mt-2">Wir senden dir einen Code per E-Mail, um dein Passwort zurückzusetzen.</p>
          </div>

          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-lime-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">E-Mail gesendet!</h2>
              <p className="text-slate-500 mb-6">Bitte überprüfe dein Postfach und folge dem Link, um dein Passwort zurückzusetzen.</p>
              <Link href={`/reset-password?role=${role}&email=${encodeURIComponent(email)}`} className="w-full inline-flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                Weiter zur Code-Eingabe
              </Link>
            </div>
          ) : (
            <>
              <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                <button
                  onClick={() => setRole('Pharmacist')}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'Pharmacist' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Freelancer
                </button>
                <button
                  onClick={() => setRole('Pharmacy')}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'Pharmacy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Apotheke
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-Mail Adresse</label>
                  <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white" placeholder="max@beispiel.de" />
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Code anfordern <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
