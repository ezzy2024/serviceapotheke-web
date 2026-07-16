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
    <aside className="bg-bone border-4 border-ink rounded-xl p-6 lg:sticky lg:top-[80px] shadow-[8px_8px_0px_0px_rgba(12,20,16,1)] font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[18px] font-black uppercase tracking-tight text-ink font-bricolage">FILTER</h2>
        <button onClick={clearFilters} className="text-[12px] font-bold text-ink underline decoration-2 underline-offset-2 hover:text-lime-700 transition-colors font-jetbrains">
          Alle löschen
        </button>
      </div>

      {/* Sortieren */}
      <div className="mb-6 pb-6 border-b-4 border-ink">
        <div className="flex justify-between items-center text-[14px] font-black text-ink mb-3 cursor-pointer font-jetbrains uppercase">
          Sortieren nach
          <ChevronDown className="w-4 h-4 text-ink" />
        </div>
        <div className="relative">
          <select 
            value={filters.sortBy}
            onChange={e => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full border-4 border-ink rounded bg-white px-3 py-2 text-[13px] font-bold text-ink appearance-none cursor-pointer outline-none shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] focus:shadow-[2px_2px_0px_0px_rgba(12,20,16,1)] focus:-translate-y-0.5 transition-all"
          >
            <option>Beste Übereinstimmung (Haversine)</option>
            <option>Höchster Stundenlohn</option>
            <option>Kürzeste Distanz</option>
            <option>Neueste zuerst</option>
          </select>
          <ChevronDown className="w-4 h-4 text-ink absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Schichtdauer */}
      <div className="mb-6 pb-6 border-b-4 border-ink">
        <div className="flex justify-between items-center text-[14px] font-black text-ink mb-3 cursor-pointer font-jetbrains uppercase">
          Schichtdauer
          <ChevronDown className="w-4 h-4 text-ink" />
        </div>
        <div className="space-y-2">
          {['Ganztags (8-10h)', 'Halbtags (4-6h)', 'Nachtdienst'].map(duration => (
            <label key={duration} className="flex items-center gap-3 py-1 cursor-pointer group">
              <input 
                type="checkbox"
                className="sr-only"
                checked={filters.durations.includes(duration)}
                onChange={() => toggleDuration(duration)}
              />
              <div className={`w-5 h-5 border-4 border-ink flex items-center justify-center shrink-0 transition-colors shadow-[2px_2px_0px_0px_rgba(12,20,16,1)] ${filters.durations.includes(duration) ? 'bg-lime' : 'bg-white'}`}>
                {filters.durations.includes(duration) && <Check className="w-4 h-4 text-ink" strokeWidth={4} />}
              </div>
              <span className="text-[14px] font-bold text-ink flex-1">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      {/* WWS-System */}
      <div>
        <div className="flex justify-between items-center text-[14px] font-black text-ink mb-3 cursor-pointer font-jetbrains uppercase">
          <div>
            WWS-System
          </div>
          <ChevronDown className="w-4 h-4 text-ink" />
        </div>
        <div className="space-y-2">
          {['CGM Lauer', 'ADG', 'Pharmatechnik (IXOS)'].map(wws => (
            <label key={wws} className="flex items-center gap-3 py-1 cursor-pointer group">
              <input 
                type="checkbox"
                className="sr-only"
                checked={filters.wws.includes(wws)}
                onChange={() => toggleWws(wws)}
              />
              <div className={`w-5 h-5 border-4 border-ink flex items-center justify-center shrink-0 transition-colors shadow-[2px_2px_0px_0px_rgba(12,20,16,1)] ${filters.wws.includes(wws) ? 'bg-lime' : 'bg-white'}`}>
                {filters.wws.includes(wws) && <Check className="w-4 h-4 text-ink" strokeWidth={4} />}
              </div>
              <span className="text-[14px] font-bold text-ink flex-1">{wws}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
