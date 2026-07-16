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
  onApply
}: ShiftCardProps) {
  
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
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
    ? 'border-[#F5C842]' 
    : 'border-ink';

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
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-lime border-4 border-b-0 border-ink rounded-t-xl text-[12px] font-bold text-ink tracking-[0.2px] font-jetbrains">
          <Star className="w-4 h-4 fill-ink text-ink" />
          GESPONSERTE VAKANZ
        </div>
      )}

      <div className={`bg-white border-4 ${cardBorder} ${isSponsored ? 'rounded-tl-none rounded-tr-none' : 'rounded-xl'} grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_auto] gap-0 transition-transform hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(12,20,16,1)] hover:shadow-[8px_8px_0px_0px_rgba(12,20,16,1)] overflow-hidden group`}>
        
        {/* Image / Logo */}
        <div className="p-4 flex items-center justify-center bg-bone border-r-4 border-ink relative min-h-[100px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-[50px] h-[50px] sm:w-[72px] sm:h-[72px] flex items-center justify-center text-[18px] sm:text-2xl font-black uppercase text-ink font-bricolage">
            {initials}
          </div>
        </div>

        {/* Body */}
        <div className="p-3.5 sm:p-5 flex flex-col gap-2 min-w-0 font-sans">
          <div className="flex flex-wrap gap-2 items-center font-jetbrains">
            <span className="px-2 py-1 rounded bg-bone text-ink border-2 border-ink text-[11px] font-bold tracking-wide shadow-[2px_2px_0px_0px_rgba(12,20,16,1)]">
              {pharmacyName}
            </span>
            <span className="px-2 py-1 rounded bg-lime text-ink border-2 border-ink text-[11px] font-bold tracking-wide shadow-[2px_2px_0px_0px_rgba(12,20,16,1)]">
              Distanz: {distance}
            </span>
          </div>
          
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[16px] sm:text-[18px] text-left font-black text-ink leading-tight hover:text-lime-700 transition-colors block font-bricolage mt-1">
            {title}
          </button>
          
          {description && (
            <div className={`text-[13px] sm:text-[14px] text-ink/80 font-medium leading-[1.5] ${isExpanded ? '' : 'line-clamp-2 sm:line-clamp-none'}`}>
              {description}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap mt-1">
            <div className="flex items-center gap-1 text-[13px] font-bold text-ink">
              <div className="flex gap-[1px]">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'fill-ink text-ink' : 'text-ink/20'}`} />
                ))}
              </div>
              {rating} · {reviews} Bewertungen
            </div>
          </div>

          {/* Variants -> Shift Dates */}
          <div className="flex gap-2 items-center flex-wrap mt-2 font-jetbrains">
            <span className="text-[12px] font-bold text-ink">TERMINE:</span>
            {dates.map((date, idx) => (
              <span key={idx} className={`px-2 py-0.5 text-[12px] font-bold border-2 border-ink shadow-[2px_2px_0px_0px_rgba(12,20,16,1)] transition-colors ${idx === 0 ? 'bg-ink text-lime' : 'bg-white text-ink'}`}>
                {date}
              </span>
            ))}
          </div>

          {/* Konditionen */}
          {konditionen && (
            <div className="flex items-start gap-2 mt-3 bg-bone p-3 border-2 border-ink shadow-[2px_2px_0px_0px_rgba(12,20,16,1)]">
              <Info className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <div className="text-[13px] font-medium text-ink">
                <span className="font-bold">KONDITIONEN:</span> {konditionen}
              </div>
            </div>
          )}

          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[12px] font-bold font-jetbrains uppercase text-ink hover:text-lime-700 flex items-center gap-1 mt-2 transition-colors w-fit underline decoration-2 underline-offset-2">
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {isExpanded ? 'Details verbergen' : 'Details einblenden'}
          </button>
        </div>

        {/* Price & CTA */}
        <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 flex flex-row sm:flex-col items-center sm:items-end justify-between min-w-[180px] border-t-4 sm:border-t-0 sm:border-l-4 border-ink gap-3 bg-white">
          
          <div className="text-left sm:text-right font-bricolage">
            <div className="text-[24px] sm:text-[28px] font-black text-ink tracking-tight leading-none">
              <small className="text-[14px] sm:text-[16px] font-bold mr-1">ab</small>€ {hourlyRate}
            </div>
            <div className="text-[12px] font-bold text-ink/70 mt-1 uppercase font-jetbrains tracking-wide">/ Stunde</div>
          </div>

          <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0">
            <div className="hidden sm:flex items-center justify-end gap-1.5 text-[12px] font-bold text-ink font-jetbrains mb-1">
              <div className="w-2 h-2 bg-lime border border-ink"></div>
              SOFORT BUCHBAR
            </div>
            
            <button 
              onClick={handleApply}
              disabled={isApplying || isApplied}
              className={`flex items-center justify-center gap-2 text-ink border-4 border-ink px-4 py-3 text-[14px] font-bold transition-all w-full tracking-[0.5px] font-jetbrains uppercase shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] hover:shadow-[6px_6px_0px_0px_rgba(12,20,16,1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none ${
                isApplied ? 'bg-bone cursor-default' : 'bg-lime hover:bg-[#d0f52b] cursor-pointer disabled:opacity-50'
              }`}
            >
              {isApplying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> BEWIRBT...</>
              ) : isApplied ? (
                <><CheckCircle2 className="w-4 h-4" /> BEWORBEN</>
              ) : (
                <><CheckSquare className="w-4 h-4" /> BEWERBEN</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
