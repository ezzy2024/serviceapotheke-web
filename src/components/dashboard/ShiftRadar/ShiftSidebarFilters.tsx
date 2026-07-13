'use client';

import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function ShiftSidebarFilters() {
  return (
    <aside className="bg-white border border-slate-100 rounded-[14px] p-5 lg:sticky lg:top-[80px] shadow-[0_1px_3px_rgba(26,31,48,0.07),0_1px_2px_rgba(26,31,48,0.05)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.6px] text-slate-400">Filter</h2>
        <button className="text-[11px] font-medium text-red-600 hover:bg-red-50 px-2 py-0.5 rounded transition-colors">
          Alle löschen
        </button>
      </div>

      {/* Sortieren */}
      <div className="mb-5 pb-5 border-b border-slate-100">
        <div className="flex justify-between items-center text-[13px] font-semibold text-slate-800 mb-2.5 cursor-pointer">
          Sortieren nach
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <select className="w-full border-[1.5px] border-slate-200 rounded-md px-2.5 py-2 text-[13px] text-slate-800 bg-slate-50 appearance-none cursor-pointer outline-none focus:border-red-600">
          <option>Beste Übereinstimmung (Haversine)</option>
          <option>Höchster Stundenlohn</option>
          <option>Kürzeste Distanz</option>
          <option>Neueste zuerst</option>
        </select>
      </div>

      {/* Schichtdauer */}
      <div className="mb-5 pb-5 border-b border-slate-100">
        <div className="flex justify-between items-center text-[13px] font-semibold text-slate-800 mb-2.5 cursor-pointer">
          Schichtdauer
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="space-y-1">
          <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md px-1 -mx-1 group">
            <div className="w-4 h-4 border-[1.5px] border-red-600 bg-red-600 rounded flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-[13px] text-slate-700 flex-1">Ganztags (8-10h)</span>
            <span className="text-[11px] font-medium text-slate-400">892</span>
          </label>
          <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md px-1 -mx-1 group">
            <div className="w-4 h-4 border-[1.5px] border-slate-300 rounded flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors"></div>
            <span className="text-[13px] text-slate-700 flex-1">Halbtags (4-6h)</span>
            <span className="text-[11px] font-medium text-slate-400">318</span>
          </label>
          <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md px-1 -mx-1 group">
            <div className="w-4 h-4 border-[1.5px] border-slate-300 rounded flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors"></div>
            <span className="text-[13px] text-slate-700 flex-1">Nachtdienst</span>
            <span className="text-[11px] font-medium text-slate-400">143</span>
          </label>
        </div>
      </div>

      {/* WWS-System */}
      <div className="mb-5 pb-5 border-b border-slate-100">
        <div className="flex justify-between items-center text-[13px] font-semibold text-slate-800 mb-2.5 cursor-pointer">
          WWS-System <span className="text-[10px] font-semibold bg-[#EEF5FF] text-[#0C5EA8] px-1.5 py-[1px] rounded ml-1">ERFORDERLICH</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="space-y-1">
          <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md px-1 -mx-1 group">
            <div className="w-4 h-4 border-[1.5px] border-slate-300 rounded flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors"></div>
            <span className="text-[13px] text-slate-700 flex-1">CGM Lauer</span>
            <span className="text-[11px] font-medium text-slate-400">1.124</span>
          </label>
          <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md px-1 -mx-1 group">
            <div className="w-4 h-4 border-[1.5px] border-slate-300 rounded flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors"></div>
            <span className="text-[13px] text-slate-700 flex-1">ADG</span>
            <span className="text-[11px] font-medium text-slate-400">187</span>
          </label>
          <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md px-1 -mx-1 group">
            <div className="w-4 h-4 border-[1.5px] border-slate-300 rounded flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors"></div>
            <span className="text-[13px] text-slate-700 flex-1">Pharmatechnik (IXOS)</span>
            <span className="text-[11px] font-medium text-slate-400">52</span>
          </label>
        </div>
        <button className="text-[12px] text-red-600 font-medium mt-1">+ 4 weitere anzeigen</button>
      </div>

      {/* Stundenlohn */}
      <div>
        <div className="flex justify-between items-center text-[13px] font-semibold text-slate-800 mb-2.5 cursor-pointer">
          Stundenlohn
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="mt-2">
          {/* Custom Slider Mockup */}
          <div className="h-1 bg-slate-200 rounded-full relative my-3">
            <div className="absolute left-[10%] right-[30%] h-full bg-red-600 rounded-full"></div>
            <div className="absolute left-[10%] -translate-x-1/2 -top-1.5 w-4 h-4 bg-white border-2 border-red-600 rounded-full cursor-pointer shadow-sm"></div>
            <div className="absolute right-[30%] translate-x-1/2 -top-1.5 w-4 h-4 bg-white border-2 border-red-600 rounded-full cursor-pointer shadow-sm"></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue="€ 80,00" className="flex-1 border-[1.5px] border-slate-200 rounded-md px-2.5 py-1.5 text-center text-[13px] text-slate-800 bg-slate-50 outline-none" />
            <span className="text-slate-400 text-xs">—</span>
            <input type="text" defaultValue="€ 150,00" className="flex-1 border-[1.5px] border-slate-200 rounded-md px-2.5 py-1.5 text-center text-[13px] text-slate-800 bg-slate-50 outline-none" />
          </div>
        </div>
      </div>

    </aside>
  );
}
