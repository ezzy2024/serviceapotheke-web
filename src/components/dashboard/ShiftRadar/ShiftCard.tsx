'use client';

import React from 'react';
import { Star, CheckCircle2, Bookmark, CheckSquare } from 'lucide-react';

interface ShiftCardProps {
  pharmacyName: string;
  initials: string;
  title: string;
  description: string;
  hourlyRate: string;
  dates: string[];
  distance: string;
  rating: string;
  reviews: string;
  isSponsored?: boolean;
}

export function ShiftCard({
  pharmacyName,
  initials,
  title,
  description,
  hourlyRate,
  dates,
  distance,
  rating,
  reviews,
  isSponsored = false
}: ShiftCardProps) {
  
  const cardBorder = isSponsored 
    ? 'border-[#F5C842] hover:border-[#E8B020] rounded-tl-none rounded-tr-none' 
    : 'border-slate-100 hover:border-slate-200';

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
        <div className="p-4 flex items-center justify-center bg-slate-50 border-r border-slate-100 relative min-h-[100px]">
          <div className="absolute top-2 left-2 w-4 h-4 border-[1.5px] border-slate-300 rounded-[4px] bg-white cursor-pointer flex items-center justify-center hover:border-red-600 transition-colors"></div>
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
          
          <a href="#" className="text-[13px] sm:text-[14px] font-semibold text-slate-900 leading-[1.35] hover:text-red-600 transition-colors block">
            {title}
          </a>
          
          <div className="text-[12px] sm:text-[12.5px] text-slate-500 leading-[1.4] line-clamp-2 sm:line-clamp-none">
            {description}
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-1">
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <div className="flex gap-[1px]">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                ))}
              </div>
              {rating} · {reviews} Bewertungen
            </div>
            <div className="text-xs text-slate-500 hidden sm:block">
              · <span>WWS: CGM Lauer</span>
            </div>
          </div>

          {/* Variants -> Shift Dates */}
          <div className="flex gap-1.5 items-center flex-wrap mt-1">
            <span className="text-[11px] text-slate-500">Termine:</span>
            {dates.map((date, idx) => (
              <span key={idx} className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border-[1.5px] transition-colors cursor-pointer ${idx === 0 ? 'border-red-600 text-red-600 bg-[#FFF0F2]' : 'border-slate-200 text-slate-700 bg-white hover:border-slate-400'}`}>
                {date}
              </span>
            ))}
          </div>

          <button className="text-[11px] text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 mt-1 transition-colors w-fit">
            ▸ Details & Konditionen
          </button>
        </div>

        {/* Price & CTA (Stacks on mobile, right column on desktop) */}
        <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 flex flex-row sm:flex-col items-center sm:items-end justify-between min-w-[160px] border-t sm:border-t-0 sm:border-l border-slate-100 gap-2 bg-slate-50/50 sm:bg-transparent">
          
          <div className="text-left sm:text-right">
            <div className="text-[20px] sm:text-[22px] font-bold text-red-600 tracking-[-0.5px] leading-none">
              <small className="text-[12px] sm:text-[14px] font-semibold">ab</small> € {hourlyRate}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">pro Stunde (zzgl. MwSt.)</div>
            <div className="text-[11px] text-[#1A7A4A] font-semibold mt-1 hidden sm:block">Fahrtkosten werden erstattet</div>
          </div>

          <div className="w-full sm:w-auto flex flex-col gap-1.5 shrink-0">
            <div className="hidden sm:flex items-center justify-end gap-1 text-[11px] font-medium text-[#1A7A4A] mb-0.5">
              <div className="w-1.5 h-1.5 bg-[#1A7A4A] rounded-full"></div>
              Sofort buchbar
            </div>
            
            <button className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-[#A50D26] text-white border-none rounded-md px-3.5 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold cursor-pointer transition-colors w-full tracking-[0.1px]">
              <CheckSquare className="w-3.5 h-3.5" />
              Bewerben
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
