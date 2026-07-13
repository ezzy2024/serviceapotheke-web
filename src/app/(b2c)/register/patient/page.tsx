'use client';
import { useState } from 'react';

export default function B2CRegisterPage() {
  const [agreedToWaiver, setAgreedToWaiver] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Patienten-Registrierung</h1>
      <div className="mb-4">
        <label className="flex items-start gap-3 p-4 bg-slate-50 border rounded-lg cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-1"
            checked={agreedToWaiver}
            onChange={(e) => setAgreedToWaiver(e.target.checked)}
            required 
          />
          <span className="text-sm text-slate-700">
            <strong>Verzicht auf das Widerrufsrecht (§ 327 BGB):</strong> Ich stimme ausdrücklich zu, dass Sie vor Ablauf der Widerrufsfrist mit der Ausführung des Vertrages beginnen. Mir ist bekannt, dass ich durch diese Zustimmung mit Beginn der Ausführung des Vertrages mein Widerrufsrecht verliere.
          </span>
        </label>
      </div>
      <button 
        disabled={!agreedToWaiver}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
      >
        Kostenpflichtig Registrieren
      </button>
    </div>
  );
}
