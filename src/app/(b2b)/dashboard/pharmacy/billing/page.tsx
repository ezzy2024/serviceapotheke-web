'use client';

import React, { useState } from 'react';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned', data);
      }
    } catch (err) {
      console.error('Failed to initiate checkout', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold tracking-tight mb-8 pb-4 text-slate-800 border-b border-slate-200">Abonnement & Abrechnung</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Plan */}
        <div className="border border-slate-200 p-8 bg-white hover:shadow-lg transition-all duration-200 shadow-md rounded-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Basic Access</h2>
          <p className="text-3xl font-bold mb-6 text-slate-900">Kostenlos</p>
          <ul className="space-y-4 mb-8 text-slate-600">
            <li className="flex items-center">
              <span className="mr-3 text-blue-500 font-bold">✓</span> Apotheken Profil
            </li>
            <li className="flex items-center text-slate-400">
              <span className="mr-3">✗</span> Shift-Radar (Echtzeit Matches)
            </li>
            <li className="flex items-center text-slate-400">
              <span className="mr-3">✗</span> Priority Support
            </li>
          </ul>
          <button className="w-full py-3.5 px-4 rounded-xl border border-slate-200 font-medium bg-slate-50 text-slate-400 cursor-not-allowed" disabled>
            Aktueller Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-blue-500 p-8 bg-white hover:shadow-xl transition-all duration-200 shadow-md rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">Empfohlen</div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Pro Command Center</h2>
            <p className="text-3xl font-bold mb-6 text-slate-900">499 € <span className="text-lg font-normal text-slate-500">/ Monat</span></p>
            <ul className="space-y-4 mb-8 text-slate-600">
              <li className="flex items-center">
                <span className="mr-3 text-blue-500 font-bold">✓</span> Alle Basic Features
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-blue-500 font-bold">✓</span> Shift-Radar (Echtzeit Matches)
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-blue-500 font-bold">✓</span> Telepharmazie WebRTC
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-blue-500 font-bold">✓</span> Priority Support
              </li>
            </ul>
          </div>
          <button 
            onClick={handleUpgrade} 
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Lade Checkout...' : 'Jetzt Upgraden'}
          </button>
        </div>
      </div>
    </div>
  );
}
