'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function KontaktPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5241';
      await fetch(`${apiUrl}/api/Notification/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="pt-32 pb-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Kontaktieren Sie uns
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Haben Sie Fragen zur Plattform oder benötigen Sie individuelle Beratung? Wir sind für Sie da.
          </p>
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-3xl p-8 border border-gray-100 text-left">
            {success ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-16 h-16 text-lime-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vielen Dank!</h2>
                <p className="text-gray-600">Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.</p>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" id="name" required value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Dein Name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-Mail Adresse</label>
                  <input type="email" id="email" required value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="max@apotheke.de" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Nachricht</label>
                  <textarea id="message" required value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Wie können wir Ihnen helfen?"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all w-full md:w-auto self-end flex items-center justify-center">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Nachricht senden
                </button>
              </form>
            )}
          </div>
          <div className="mt-12">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              &larr; Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
