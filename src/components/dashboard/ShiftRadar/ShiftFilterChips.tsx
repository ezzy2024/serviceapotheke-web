'use client';

import React from 'react';

export function ShiftFilterChips() {
  return (
    <div className="w-full font-sans">
      <div className="text-[12px] font-bold uppercase tracking-[1px] text-ink/70 mb-3 font-jetbrains">
        Was genau suchen Sie?
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        
        {/* Alle Schichten (Active style) */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 text-[14px] font-bold cursor-pointer transition-all border-2 border-ink bg-lime text-ink uppercase tracking-wider hover:bg-lime/90">
          Alle Schichten
          <span className="text-[11px] font-black bg-ink text-lime px-1.5 py-[1px] font-jetbrains">124</span>
        </div>

        {/* Notdienst (Alert style) */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 text-[14px] font-bold cursor-pointer transition-all border-2 border-ink bg-persimmon text-bone uppercase tracking-wider hover:bg-persimmon/90">
          Notdienst
          <span className="text-[11px] font-black bg-ink text-persimmon px-1.5 py-[1px] font-jetbrains">12</span>
        </div>

        {/* Urlaubsvertretung */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 text-[14px] font-bold cursor-pointer transition-all border-2 border-ink bg-bone text-ink uppercase tracking-wider hover:bg-ink hover:text-bone">
          Urlaubsvertretung
          <span className="text-[11px] font-black opacity-70 bg-ink/10 px-1.5 py-[1px] font-jetbrains">48</span>
        </div>

        {/* Krankheitsausfall */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 text-[14px] font-bold cursor-pointer transition-all border-2 border-ink bg-bone text-ink uppercase tracking-wider hover:bg-ink hover:text-bone">
          🚨 Krankheitsausfall
          <span className="text-[11px] font-black bg-ink/10 px-1.5 py-[1px] font-jetbrains">8</span>
        </div>

        {/* Wochenende */}
        <div className="flex items-center gap-1.5 py-[7px] px-3.5 text-[14px] font-bold cursor-pointer transition-all border-2 border-ink bg-bone text-ink uppercase tracking-wider hover:bg-ink hover:text-bone">
          📆 Wochenende
          <span className="text-[11px] font-black bg-ink/10 px-1.5 py-[1px] font-jetbrains">56</span>
        </div>

      </div>
    </div>
  );
}
