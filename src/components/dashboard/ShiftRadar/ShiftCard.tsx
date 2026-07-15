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
    ? 'border-[#F5C842] hover:border-[#E8B020] rounded-tl-none rounded-tr-none' 
    : 'border-slate-100 hover:border-slate-200';

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
    <div className="mb-2">
      {isSponsored && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8E6] border border-b-0 border-[#F5C842] rounded-t-[10px] text-[11px] font-bold text-[#92600A] tracking-[0.2px]">
          <Star className="w-3 h-3 fill-current" />
          Gesponserte Vakanz
          <span className="ml-auto font-normal text-[10.5px] text-[#B8860B] underline cursor-pointer hover:text-[#92600A]">
            Was bedeutet das? ⓘ
          </span>
        </div>
      )}

      <div className={`bg-white border ${cardBorder} rounded-[10px] grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_auto] gap-0 transition-all hover:shadow-[0_4px_12px_rgba(26,31,48,0.10)] overflow-hidden group`}>
        
        {/* Image / Logo */}
        <div className="p-4 flex items-center justify-center bg-slate-50 border-r border-slate-100 relative min-h-[100px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-[50px] h-[50px] sm:w-[72px] sm:h-[72px] rounded-md flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.3px] text-center bg-[#E8F0FE] text-[#3355AA]">
            {initials}
          </div>
        </div>

        {/* Body */}
        <div className="p-3.5 sm:p-4 flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap gap-1 items-center">
            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold tracking-[0.1px] bg-[#FFF3E0] text-[#C84E00] border border-[#FFD4A8]">
              {pharmacyName}
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold tracking-[0.1px] bg-[#E0F7F4] text-[#0E6655] border border-[#BDECD4]">
              Distanz: {distance}
            </span>
          </div>
          
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[13px] sm:text-[14px] text-left font-semibold text-slate-900 leading-[1.35] hover:text-red-600 transition-colors block">
            {title}
          </button>
          
          {description && (
            <div className={`text-[12px] sm:text-[12.5px] text-slate-500 leading-[1.4] ${isExpanded ? '' : 'line-clamp-2 sm:line-clamp-none'}`}>
              {description}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap mt-1">
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <div className="flex gap-[1px]">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                ))}
              </div>
              {rating} · {reviews} Bewertungen
            </div>
          </div>

          {/* Variants -> Shift Dates */}
          <div className="flex gap-1.5 items-center flex-wrap mt-1">
            <span className="text-[11px] text-slate-500">Termine:</span>
            {dates.map((date, idx) => (
              <span key={idx} className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border-[1.5px] transition-colors ${idx === 0 ? 'border-red-600 text-red-600 bg-[#FFF0F2]' : 'border-slate-200 text-slate-700 bg-white'}`}>
                {date}
              </span>
            ))}
          </div>

          {/* Konditionen */}
          {konditionen && (
            <div className="flex items-start gap-1.5 mt-2 bg-slate-50 p-2 rounded-md border border-slate-100">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-[11px] font-medium text-slate-600">
                <span className="font-semibold text-slate-700">Konditionen:</span> {konditionen}
              </div>
            </div>
          )}

          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 mt-1 transition-colors w-fit">
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {isExpanded ? 'Details verbergen' : 'Details einblenden'}
          </button>
        </div>

        {/* Price & CTA */}
        <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 flex flex-row sm:flex-col items-center sm:items-end justify-between min-w-[160px] border-t sm:border-t-0 sm:border-l border-slate-100 gap-2 bg-slate-50/50 sm:bg-transparent">
          
          <div className="text-left sm:text-right">
            <div className="text-[20px] sm:text-[22px] font-bold text-red-600 tracking-[-0.5px] leading-none">
              <small className="text-[12px] sm:text-[14px] font-semibold">ab</small> € {hourlyRate}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">pro Stunde (zzgl. MwSt.)</div>
          </div>

          <div className="w-full sm:w-auto flex flex-col gap-1.5 shrink-0">
            <div className="hidden sm:flex items-center justify-end gap-1 text-[11px] font-medium text-[#1A7A4A] mb-0.5">
              <div className="w-1.5 h-1.5 bg-[#1A7A4A] rounded-full"></div>
              Sofort buchbar
            </div>
            
            <button 
              onClick={handleApply}
              disabled={isApplying || isApplied}
              className={`flex items-center justify-center gap-1.5 text-white border-none rounded-md px-3.5 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold transition-colors w-full tracking-[0.1px] ${
                isApplied ? 'bg-green-600 hover:bg-green-700 cursor-default' : 'bg-red-600 hover:bg-[#A50D26] cursor-pointer disabled:opacity-50'
              }`}
            >
              {isApplying ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Bewirbt...</>
              ) : isApplied ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Beworben</>
              ) : (
                <><CheckSquare className="w-3.5 h-3.5" /> Bewerben</>
              )}
            </button>
            <button className="flex items-center justify-center gap-1.5 bg-white hover:bg-[#FFF0F2] text-slate-500 hover:text-red-600 border-[1.5px] border-slate-200 hover:border-red-600 rounded-md px-2.5 py-1.5 text-[11px] font-medium cursor-pointer transition-colors w-full">
              <Bookmark className="w-3 h-3" />
              Merken
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
