'use client';

import React from 'react';

export function ShiftFilterChips() {
  return (
    <div className="w-full font-sans">
      <div className="text-sm font-semibold text-slate-600 mb-3">
        Was genau suchen Sie?
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        
        {/* Alle Schichten (Active style) */}
        <div className="flex items-center gap-2 py-1.5 px-4 text-sm font-semibold cursor-pointer transition-all border border-blue-600 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700">
          Alle Schichten
          <span className="text-xs font-bold bg-white text-blue-600 px-2 py-0.5 rounded-full">124</span>
        </div>

        {/* Notdienst (Alert style) */}
        <div className="flex items-center gap-2 py-1.5 px-4 text-sm font-semibold cursor-pointer transition-all border border-red-500 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600">
          Notdienst
          <span className="text-xs font-bold bg-white text-red-500 px-2 py-0.5 rounded-full">12</span>
        </div>

        {/* Urlaubsvertretung */}
        <div className="flex items-center gap-2 py-1.5 px-4 text-sm font-semibold cursor-pointer transition-all border border-slate-200 bg-white text-slate-700 rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300">
          Urlaubsvertretung
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">48</span>
        </div>

        {/* Krankheitsausfall */}
        <div className="flex items-center gap-2 py-1.5 px-4 text-sm font-semibold cursor-pointer transition-all border border-slate-200 bg-white text-slate-700 rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300">
          🚨 Krankheitsausfall
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">8</span>
        </div>

        {/* Wochenende */}
        <div className="flex items-center gap-2 py-1.5 px-4 text-sm font-semibold cursor-pointer transition-all border border-slate-200 bg-white text-slate-700 rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300">
          📆 Wochenende
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">56</span>
        </div>

      </div>
    </div>
  );
}
