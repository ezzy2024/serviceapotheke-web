'use client';

import React from 'react';

export function ShiftFilterChips() {
  return (
    <div className="w-full">
      <div className="text-[11px] font-semibold uppercase tracking-[0.8px] text-slate-400 mb-2">
        Was genau suchen Sie?
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        
        {/* Alle Schichten */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border-[1.5px] whitespace-nowrap select-none bg-slate-900 border-slate-900 text-white shadow-sm hover:opacity-90">
          Alle Schichten
          <span className="text-[11px] font-semibold bg-white/20 px-1.5 py-[1px] rounded-full">124</span>
        </div>

        {/* Notdienst (Active style) */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border-[1.5px] whitespace-nowrap select-none bg-red-600 border-red-600 text-white shadow-[0_2px_8px_rgba(220,38,38,0.25)] hover:bg-red-700">
          Notdienst
          <span className="text-[11px] font-semibold bg-white/25 px-1.5 py-[1px] rounded-full">12</span>
        </div>

        {/* Urlaubsvertretung */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border-[1.5px] whitespace-nowrap select-none bg-white border-slate-200 text-slate-700 hover:border-red-600 hover:text-red-600 shadow-sm">
          Urlaubsvertretung
          <span className="text-[11px] font-semibold opacity-70 bg-black/5 px-1.5 py-[1px] rounded-full">48</span>
        </div>

        {/* Krankheitsausfall */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border-[1.5px] whitespace-nowrap select-none bg-[#EEF5FF] border-[#C7DEFF] text-[#0C5EA8] hover:border-[#0C5EA8] shadow-sm">
          🚨 Krankheitsausfall
          <span className="text-[11px] font-semibold bg-[#0C5EA8]/10 px-1.5 py-[1px] rounded-full">8</span>
        </div>

        {/* Wochenende */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border-[1.5px] whitespace-nowrap select-none bg-[#F0FBF4] border-[#BDECD4] text-[#1A7A4A] hover:border-[#1A7A4A] shadow-sm">
          📆 Wochenende
          <span className="text-[11px] font-semibold bg-[#1A7A4A]/10 px-1.5 py-[1px] rounded-full">56</span>
        </div>

      </div>
    </div>
  );
}
