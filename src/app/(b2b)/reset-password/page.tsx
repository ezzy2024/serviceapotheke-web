'use client';
import { useState, useEffect, Suspense } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialRole = (searchParams?.get('role') as 'Pharmacist' | 'Pharmacy') || 'Pharmacist';
  const initialEmail = searchParams?.get('email') || '';
  
  const [role] = useState<'Pharmacist' | 'Pharmacy'>(initialRole);
  const [email] = useState(initialEmail);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const endpoint = role === 'Pharmacy' ? '/Pharmacy/reset-password' : '/Pharmacist/reset-password';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5241';
      
      const res = await fetch(`${apiUrl}/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Fehler beim Zurücksetzen des Passworts.');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Neues Passwort</h1>
        <p className="text-slate-500 mt-2">Gib den 6-stelligen Code aus der E-Mail und dein neues Passwort ein.</p>
      </div>

      {success ? (
        <div className="text-center py-4">
          <CheckCircle2 className="w-16 h-16 text-lime-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Passwort geändert!</h2>
          <p className="text-slate-500 mb-6">Dein Passwort wurde erfolgreich aktualisiert. Du kannst dich nun anmelden.</p>
          <Link href="/login" className="w-full inline-flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
            Zum Login <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
            <input type="email" disabled value={email} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500" />
          </div>
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-1">Bestätigungscode</label>
            <input type="text" id="token" required value={token} onChange={e => setToken(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-center tracking-[0.5em] font-mono text-xl" placeholder="123456" />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">Neues Passwort</label>
            <input type="password" id="newPassword" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Passwort bestätigen</label>
            <input type="password" id="confirmPassword" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            <Lock className="w-4 h-4 mr-2" /> Passwort speichern
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-center p-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
