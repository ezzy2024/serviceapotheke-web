'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, Bookmark, CheckSquare, Loader2, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ShiftCardProps {
  jobId: number;
  pharmacyName: string;
  initials: string;
  title: string;
  description: string;
  conditionsJson?: string;
  hourlyRate: string;
  dates: string[];
  distance: string;
  rating: string;
  reviews: string;
  isSponsored?: boolean;
  initialHasApplied?: boolean;
  onApply?: (jobId: number) => Promise<boolean>;
}

export function ShiftCard({
  jobId,
  pharmacyName,
  initials,
  title,
  description,
  conditionsJson,
  hourlyRate,
  dates,
  distance,
  rating,
  reviews,
  isSponsored = false,
  initialHasApplied = false,
  onApply
}: ShiftCardProps) {
  
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(initialHasApplied);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = async () => {
    if (!onApply || isApplied || isApplying) return;
    setIsApplying(true);
    try {
      const success = await onApply(jobId);
      if (success) {
        setIsApplied(true);
      }
    } catch (err: any) {
      if (err.message === 'Already applied') {
        setIsApplied(true);
      } else {
        alert("Fehler bei der Bewerbung. Bitte versuche es später noch einmal.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  const cardBorder = isSponsored 
    ? 'border-yellow-400' 
    : 'border-slate-200';

  // Parse Konditionen from JSON
  let konditionen = null;
  if (conditionsJson) {
    try {
      const parsed = JSON.parse(conditionsJson);
      const parts = [];
      if (parsed.travelExpensePerKm) parts.push(`Fahrtkosten: ${parsed.travelExpensePerKm.toLocaleString('de-DE')} €/km`);
      if (parsed.travelExpenseCap) parts.push(`Maximal ${parsed.travelExpenseCap} €`);
      if (parsed.accommodation) parts.push(`Unterkunft: ${parsed.accommodation}`);
      if (parts.length > 0) {
        konditionen = parts.join(' • ');
      }
    } catch (e) {
      // invalid json, ignore
    }
  }

  return (
    <div className="mb-4">
      {isSponsored && (
        <div className="flex items-center gap-1.5 px-4 py-2 bg-yellow-50 border border-b-0 border-yellow-400 rounded-t-xl text-xs font-semibold text-yellow-800">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          Gesponserte Vakanz
        </div>
      )}

      <div className={`bg-white border ${cardBorder} ${isSponsored ? 'rounded-tl-none rounded-tr-none' : 'rounded-2xl'} grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_auto] gap-0 transition-transform hover:-translate-y-1 shadow-sm hover:shadow-lg overflow-hidden group`}>
        
        {/* Image / Logo */}
        <div className="p-4 flex items-center justify-center bg-slate-50 border-r border-slate-200 relative min-h-[100px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-[50px] h-[50px] sm:w-[72px] sm:h-[72px] flex items-center justify-center text-lg sm:text-2xl font-bold text-slate-700 bg-white rounded-full shadow-sm">
            {initials}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
              {pharmacyName}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
              Distanz: {distance}
            </span>
          </div>
          
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-lg sm:text-xl text-left font-bold text-slate-900 leading-tight hover:text-blue-600 transition-colors block mt-1">
            {title}
          </button>
          
          {description && (
            <div className={`text-sm text-slate-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2 sm:line-clamp-none'}`}>
              {description}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap mt-1">
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="ml-1">{rating} · {reviews} Bewertungen</span>
            </div>
          </div>

          {/* Variants -> Shift Dates */}
          <div className="flex gap-2 items-center flex-wrap mt-3">
            <span className="text-sm font-medium text-slate-500">Termine:</span>
            {dates.map((date, idx) => (
              <span key={idx} className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${idx === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'}`}>
                {date}
              </span>
            ))}
          </div>

          {/* Konditionen */}
          {konditionen && (
            <div className="flex items-start gap-3 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Konditionen:</span> {konditionen}
              </div>
            </div>
          )}

          <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-3 transition-colors w-fit">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? 'Details verbergen' : 'Details einblenden'}
          </button>
        </div>

        {/* Price & CTA */}
        <div className="col-span-2 sm:col-span-1 p-4 sm:p-6 flex flex-row sm:flex-col items-center sm:items-end justify-between min-w-[180px] border-t sm:border-t-0 sm:border-l border-slate-200 gap-4 bg-slate-50/50">
          
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-none">
              <span className="text-sm sm:text-base font-normal text-slate-500 mr-1">ab</span>€{hourlyRate}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1">/ Stunde</div>
          </div>

          <div className="w-full sm:w-auto flex flex-col gap-3 shrink-0">
            <div className="hidden sm:flex items-center justify-end gap-2 text-xs font-medium text-slate-600 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              Sofort buchbar
            </div>
            
            <button 
              onClick={handleApply}
              disabled={isApplying || isApplied}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all w-full shadow-sm hover:shadow-md active:scale-[0.98] ${
                isApplied ? 'bg-slate-100 text-slate-500 cursor-default border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50'
              }`}
            >
              {isApplying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Bewerbung läuft...</>
              ) : isApplied ? (
                <><CheckCircle2 className="w-4 h-4" /> Beworben</>
              ) : (
                <><CheckSquare className="w-4 h-4" /> Bewerben</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
