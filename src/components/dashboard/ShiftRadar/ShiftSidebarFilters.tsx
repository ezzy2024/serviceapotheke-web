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
    <aside className="bg-white border-2 border-ink rounded-xl p-6 lg:sticky lg:top-[80px] shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[18px] font-bold text-ink font-bricolage">Filter</h2>
        <button onClick={clearFilters} className="text-[13px] font-medium text-ink underline decoration-1 underline-offset-2 hover:text-lime-700 transition-colors">
          Alle löschen
        </button>
      </div>

      {/* Sortieren */}
      <div className="mb-6 pb-6 border-b-2 border-ink/10">
        <div className="flex justify-between items-center text-[15px] font-bold text-ink mb-3 font-bricolage">
          Sortieren nach
          <ChevronDown className="w-4 h-4 text-ink" />
        </div>
        <div className="relative">
          <select 
            value={filters.sortBy}
            onChange={e => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full border-2 border-ink rounded-lg bg-white px-3 py-2 text-[14px] font-medium text-ink appearance-none cursor-pointer outline-none focus:shadow-[2px_2px_0px_0px_rgba(12,20,16,1)] transition-all"
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
      <div className="mb-6 pb-6 border-b-2 border-ink/10">
        <div className="flex justify-between items-center text-[15px] font-bold text-ink mb-3 font-bricolage">
          Schichtdauer
          <ChevronDown className="w-4 h-4 text-ink" />
        </div>
        <div className="space-y-2">
          {['Ganztags (8-10h)', 'Halbtags (4-6h)', 'Nachtdienst'].map(duration => (
            <div 
              key={duration} 
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
              onClick={() => toggleDuration(duration)}
            >
              <div className={`w-5 h-5 border-2 border-ink rounded-[4px] flex items-center justify-center shrink-0 transition-colors group-hover:border-ink ${filters.durations.includes(duration) ? 'bg-lime' : 'bg-white'}`}>
                {filters.durations.includes(duration) && <Check className="w-4 h-4 text-ink" strokeWidth={3} />}
              </div>
              <span className="text-[14px] font-medium text-ink/80 group-hover:text-ink transition-colors flex-1">{duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WWS-System */}
      <div>
        <div className="flex justify-between items-center text-[15px] font-bold text-ink mb-3 font-bricolage">
          <div>
            WWS-System
          </div>
          <ChevronDown className="w-4 h-4 text-ink" />
        </div>
        <div className="space-y-2">
          {['CGM Lauer', 'ADG', 'Pharmatechnik (IXOS)'].map(wws => (
            <div 
              key={wws} 
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
              onClick={() => toggleWws(wws)}
            >
              <div className={`w-5 h-5 border-2 border-ink rounded-[4px] flex items-center justify-center shrink-0 transition-colors group-hover:border-ink ${filters.wws.includes(wws) ? 'bg-lime' : 'bg-white'}`}>
                {filters.wws.includes(wws) && <Check className="w-4 h-4 text-ink" strokeWidth={3} />}
              </div>
              <span className="text-[14px] font-medium text-ink/80 group-hover:text-ink transition-colors flex-1">{wws}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
