'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHistoryTrap } from '@/hooks/useHistoryTrap';

export default function KioskConsentPage() {
  // Activate security hook to trap navigation
  useHistoryTrap();

  const router = useRouter();
  
  const [patientName, setPatientName] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [ikNumber, setIkNumber] = useState('');
  
  const [isTelepharmacyConsentGranted, setIsTelepharmacyConsentGranted] = useState(false);
  const [isWwsExportGranted, setIsWwsExportGranted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTelepharmacyConsentGranted) return;

    setIsSubmitting(true);

    try {
      // In a real app, you'd get the auth token via a context or secure storage
      const res = await fetch('/api/atm/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientName,
          healthInsuranceName: insuranceName,
          healthInsuranceNumber: insuranceNumber,
          ikNumber,
          signatureBlob: "base64-dummy-signature-blob", // Usually from a SignaturePad component
          isTelepharmacyConsentGranted,
          isWwsExportGranted
        })
      });

      if (res.ok) {
        // Force navigation to the next secure step
        router.replace('/kiosk/session');
      } else {
        alert('Fehler beim Speichern der Einwilligung.');
      }
    } catch (error) {
      console.error(error);
      alert('Netzwerkfehler');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-gray-900">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Einwilligungserklärung (DSGVO)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Vor- und Nachname</label>
              <input 
                type="text" 
                required 
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full border rounded-lg p-3" 
                placeholder="Dein Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Krankenkasse</label>
              <input 
                type="text" 
                required 
                value={insuranceName}
                onChange={e => setInsuranceName(e.target.value)}
                className="w-full border rounded-lg p-3" 
                placeholder="AOK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Versichertennummer (KVNR)</label>
              <input 
                type="text" 
                value={insuranceNumber}
                onChange={e => setInsuranceNumber(e.target.value)}
                className="w-full border rounded-lg p-3" 
                placeholder="A123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">IK-Nummer</label>
              <input 
                type="text" 
                value={ikNumber}
                onChange={e => setIkNumber(e.target.value)}
                className="w-full border rounded-lg p-3" 
                placeholder="104000000"
              />
            </div>
          </div>

          <hr className="my-8" />

          {/* Granular Opt-Ins */}
          <div className="space-y-4">
            <label className="flex items-start space-x-4 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="w-6 h-6 mt-1 text-blue-600"
                checked={isTelepharmacyConsentGranted}
                onChange={e => setIsTelepharmacyConsentGranted(e.target.checked)}
                required
              />
              <div>
                <span className="font-semibold block text-lg">Zwingend erforderlich</span>
                <span className="text-gray-600">
                  Ich willige in die Verarbeitung meiner Gesundheitsdaten zur Durchführung der Assistierten Telemedizin (aTM) ein. Ohne diese Einwilligung kann die Sitzung nicht fortgesetzt werden.
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-4 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="w-6 h-6 mt-1 text-blue-600"
                checked={isWwsExportGranted}
                onChange={e => setIsWwsExportGranted(e.target.checked)}
              />
              <div>
                <span className="font-semibold block text-lg">Optional</span>
                <span className="text-gray-600">
                  Ich willige ein, dass meine Daten zur Anlage eines Kundenprofils an das lokale Warenwirtschaftssystem (WWS) der Apotheke übertragen werden.
                </span>
              </div>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={!isTelepharmacyConsentGranted || isSubmitting}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-xl transition-all shadow-lg"
          >
            {isSubmitting ? 'Wird verarbeitet...' : 'Einwilligen & Weiter'}
          </button>
        </form>
      </div>
    </div>
  );
}
