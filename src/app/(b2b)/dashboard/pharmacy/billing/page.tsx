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
    <div className="p-8 max-w-5xl mx-auto font-mono">
      <h1 className="text-4xl font-bold uppercase tracking-tighter mb-8 border-b-4 border-black pb-4 text-black">Abonnement & Abrechnung</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Plan */}
        <div className="border-4 border-black p-6 bg-white hover:-translate-y-2 transition-transform duration-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold uppercase mb-2">Basic Access</h2>
          <p className="text-xl font-bold mb-6">Kostenlos</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <span className="mr-2">✓</span> Apotheken Profil
            </li>
            <li className="flex items-center text-gray-500 line-through">
              <span className="mr-2">✗</span> Shift-Radar (Echtzeit Matches)
            </li>
            <li className="flex items-center text-gray-500 line-through">
              <span className="mr-2">✗</span> Priority Support
            </li>
          </ul>
          <button className="w-full py-3 px-4 border-2 border-black font-bold uppercase bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
            Aktueller Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border-4 border-black p-6 bg-[#E0FF00] hover:-translate-y-2 transition-transform duration-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <div className="inline-block bg-black text-white text-xs font-bold uppercase px-2 py-1 mb-4">Empfohlen</div>
            <h2 className="text-2xl font-bold uppercase mb-2">Pro Command Center</h2>
            <p className="text-xl font-bold mb-6">499 € / Monat</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="mr-2 font-bold">✓</span> Alle Basic Features
              </li>
              <li className="flex items-center">
                <span className="mr-2 font-bold">✓</span> Shift-Radar (Echtzeit Matches)
              </li>
              <li className="flex items-center">
                <span className="mr-2 font-bold">✓</span> Telepharmazie WebRTC
              </li>
              <li className="flex items-center">
                <span className="mr-2 font-bold">✓</span> Priority Support
              </li>
            </ul>
          </div>
          <button 
            onClick={handleUpgrade} 
            disabled={loading}
            className="w-full py-3 px-4 border-4 border-black font-bold uppercase bg-black text-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            {loading ? 'Lade Checkout...' : 'Jetzt Upgraden'}
          </button>
        </div>
      </div>
    </div>
  );
}
