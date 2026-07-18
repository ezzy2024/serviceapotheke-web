'use client';

import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface FilterState {
  sortBy: string;
  durations: string[];
  wws: string[];
}

interface ShiftSidebarFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function ShiftSidebarFilters({ filters, onFilterChange }: ShiftSidebarFiltersProps) {
  const toggleDuration = (d: string) => {
    const newDurations = filters.durations.includes(d)
      ? filters.durations.filter(x => x !== d)
      : [...filters.durations, d];
    onFilterChange({ ...filters, durations: newDurations });
  };

  const toggleWws = (w: string) => {
    const newWws = filters.wws.includes(w)
      ? filters.wws.filter(x => x !== w)
      : [...filters.wws, w];
    onFilterChange({ ...filters, wws: newWws });
  };

  const clearFilters = () => {
    onFilterChange({
      sortBy: 'Beste Übereinstimmung (Haversine)',
      durations: [],
      wws: []
    });
  };

  return (
    <aside className="bg-white border border-slate-200 rounded-2xl p-6 lg:sticky lg:top-[80px] shadow-sm font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Filter</h2>
        <button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Alle löschen
        </button>
      </div>

      {/* Sortieren */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <div className="flex justify-between items-center text-sm font-semibold text-slate-800 mb-3">
          Sortieren nach
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
        <div className="relative">
          <select 
            value={filters.sortBy}
            onChange={e => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option>Beste Übereinstimmung (Haversine)</option>
            <option>Höchster Stundenlohn</option>
            <option>Kürzeste Distanz</option>
            <option>Neueste zuerst</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Schichtdauer */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <div className="flex justify-between items-center text-sm font-semibold text-slate-800 mb-3">
          Schichtdauer
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
        <div className="space-y-2.5">
          {['Ganztags (8-10h)', 'Halbtags (4-6h)', 'Nachtdienst'].map(duration => (
            <div 
              key={duration} 
              className="flex items-center gap-3 py-1 cursor-pointer group"
              onClick={() => toggleDuration(duration)}
            >
              <div className={`w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors ${filters.durations.includes(duration) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                {filters.durations.includes(duration) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex-1">{duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WWS-System */}
      <div>
        <div className="flex justify-between items-center text-sm font-semibold text-slate-800 mb-3">
          <div>
            WWS-System
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
        <div className="space-y-2.5">
          {['CGM Lauer', 'ADG', 'Pharmatechnik (IXOS)'].map(wws => (
            <div 
              key={wws} 
              className="flex items-center gap-3 py-1 cursor-pointer group"
              onClick={() => toggleWws(wws)}
            >
              <div className={`w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors ${filters.wws.includes(wws) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                {filters.wws.includes(wws) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex-1">{wws}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
