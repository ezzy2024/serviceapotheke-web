"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type IntentRole = "pharmacy" | "pharmacist" | "consumer" | null;

export default function OnboardingEngine() {
  const router = useRouter();
  const toast = useToast();
  
  const [role, setRole] = useState<IntentRole>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!role) {
      toast.error("Bitte wählen Sie eine Rolle aus.");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    setIsLoading(true);

    try {
      // Encode payload to pass via query params (or could use short-lived cookie)
      const queryParams = new URLSearchParams({ email, intent: role }).toString();

      // Routing handoff based on intent
      if (role === "pharmacy") {
        router.push(`/register/pharmacy?${queryParams}`);
      } else if (role === "pharmacist") {
        router.push(`/register/pharmacist?${queryParams}`);
      } else if (role === "consumer") {
        router.push(`/register?${queryParams}`); // Maps to (b2c)/register
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Willkommen bei ServiceApotheke</h1>
          <p className="text-slate-500">Bitte wählen Sie, wie Sie unsere Plattform nutzen möchten.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setRole("consumer")}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${role === "consumer" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}
          >
            <h3 className="font-semibold text-slate-900 text-lg">Ich bin Patient / Kunde</h3>
            <p className="text-sm text-slate-500 mt-1">E-Rezepte einlösen, Medikamente bestellen & Gesundheitsdaten verwalten.</p>
          </button>

          <button 
            onClick={() => setRole("pharmacist")}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${role === "pharmacist" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}
          >
            <h3 className="font-semibold text-slate-900 text-lg">Ich bin Apotheker / PTA</h3>
            <p className="text-sm text-slate-500 mt-1">Schichten finden, AÜG-Verträge verwalten & Profil erstellen.</p>
          </button>

          <button 
            onClick={() => setRole("pharmacy")}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${role === "pharmacy" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}
          >
            <h3 className="font-semibold text-slate-900 text-lg">Wir sind eine Apotheke</h3>
            <p className="text-sm text-slate-500 mt-1">Personal finden, Dienstpläne organisieren & Compliance sichern.</p>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">E-Mail Adresse</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ihre.email@beispiel.de"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <Button 
          onClick={handleContinue} 
          isLoading={isLoading}
          size="lg"
          className="w-full"
        >
          Weiter
        </Button>

      </div>
    </div>
  );
}
