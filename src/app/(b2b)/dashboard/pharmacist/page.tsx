'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { ShiftSidebarFilters } from '@/components/dashboard/ShiftRadar/ShiftSidebarFilters';
import { ShiftFilterChips } from '@/components/dashboard/ShiftRadar/ShiftFilterChips';
import { HaversinePriorityCard } from '@/components/dashboard/ShiftRadar/HaversinePriorityCard';
import { ShiftCard } from '@/components/dashboard/ShiftRadar/ShiftCard';
import { LayoutGrid, List } from 'lucide-react';

export default function ShiftRadarPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    sortBy: 'Beste Übereinstimmung (Haversine)',
    durations: [] as string[],
    wws: [] as string[]
  });

  const fetchJobs = async () => {
    try {
      const res = await api.get('/Job/available');
      setShifts(res.data);
    } catch (error) {
      console.error('Failed to load available jobs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId: number) => {
    if (!user?.id) return false;
    try {
      await api.post(`/Allocation/${jobId}/apply`, { pharmacistId: user.id });
      return true; // success
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Already applied');
      }
      throw error;
    }
  };

  const filteredShifts = shifts.filter(shift => {
    if (filters.wws.length > 0) {
      const desc = (shift.description || '').toLowerCase() + ' ' + (shift.title || '').toLowerCase();
      const hasWws = filters.wws.some(w => {
        const keyword = w.split(' ')[0].toLowerCase();
        return desc.includes(keyword);
      });
      if (!hasWws) return false;
    }

    if (filters.durations.length > 0) {
      const text = (shift.description || '').toLowerCase() + ' ' + (shift.title || '').toLowerCase();
      const match = filters.durations.some(d => {
        if (d.includes('Ganztags') && (text.includes('ganztag') || text.includes('urlaub'))) return true;
        if (d.includes('Halbtags') && (text.includes('halbtag') || text.includes('stunden'))) return true;
        if (d.includes('Nachtdienst') && (text.includes('nacht') || text.includes('notdienst'))) return true;
        return false;
      });
      if (!match) return false; // Shrink list
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-bone font-sans">
      {/* Container for the Chips */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 pt-10">
        <ShiftFilterChips />
      </div>

      <main className="max-w-[1320px] mx-auto px-6 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-8 items-start">
        
        {/* Sidebar */}
        <ShiftSidebarFilters filters={filters} onFilterChange={setFilters} />
        {/* Results Area */}
        <div className="min-w-0">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="text-[15px] text-ink font-medium">
              {isLoading ? (
                <span>Lade Vakanzen...</span>
              ) : (
                <><strong className="text-[20px] text-ink font-bold font-bricolage">{filteredShifts.length} Vakanzen</strong> <span className="text-ink/80">für Ihr Profil</span></>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex border-2 border-ink rounded-lg overflow-hidden shadow-sm">
                <button className="px-3 py-2 bg-ink flex items-center justify-center transition-colors">
                  <List className="w-5 h-5 text-white" />
                </button>
                <button className="px-3 py-2 bg-white hover:bg-bone flex items-center justify-center transition-colors">
                  <LayoutGrid className="w-5 h-5 text-ink" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Match */}
          <HaversinePriorityCard />

          <div className="flex items-center gap-4 my-6 text-[14px] font-bold text-ink/70 font-bricolage">
            <div className="flex-1 h-px bg-ink/20"></div>
            Weitere Vakanzen
            <div className="flex-1 h-px bg-ink/20"></div>
          </div>

          {/* Shift Cards Feed */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
               <div className="text-center py-10 font-bold text-ink">Lade...</div>
            ) : filteredShifts.length === 0 ? (
               <div className="text-center py-12 text-ink bg-white border-2 border-ink rounded-xl shadow-sm font-medium text-[16px]">Keine offenen Schichten für diese Filter gefunden.</div>
            ) : (
              filteredShifts.map((shift: any) => {
                const dates = [];
                if (shift.startDate && shift.endDate) {
                  const s = new Date(shift.startDate).toLocaleDateString('de-DE');
                  const e = new Date(shift.endDate).toLocaleDateString('de-DE');
                  dates.push(s === e ? s : `${s} - ${e}`);
                }

                // Make initials from pharmacy name
                const pharmacyName = shift.pharmacy?.name || 'Apotheke';
                const words = pharmacyName.split(' ');
                const initials = words.length > 1 
                  ? (words[0][0] + words[1][0]).toUpperCase() 
                  : pharmacyName.substring(0, 2).toUpperCase();

                // Map ReasonForVacancy to readable text
                const reasonMap: Record<string, string> = {
                  'Urlaub': 'Urlaubsvertretung',
                  'Krankheit': 'Krankheitsausfall',
                  'Engpass': 'Personalengpass',
                  'Notdienst': 'Notdienst'
                };
                const descriptionText = shift.reasonForVacancy ? (reasonMap[shift.reasonForVacancy] || shift.reasonForVacancy) : '';

                return (
                  <ShiftCard 
                    key={shift.id} 
                    jobId={shift.id}
                    pharmacyName={pharmacyName}
                    initials={initials}
                    title={shift.title || 'Schichtangebot'}
                    description={descriptionText}
                    conditionsJson={shift.description || ''}
                    hourlyRate={shift.salary?.toFixed(2) || '0,00'}
                    dates={dates}
                    distance="~ km"
                    rating="0.0"
                    reviews="0"
                    onApply={handleApply}
                  />
                );
              })
            )}
          </div>

          {/* Pagination */}
          {filteredShifts.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-10">
               <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-bold border-2 border-ink bg-ink text-white shadow-sm">
                 1
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-medium border-2 border-ink bg-white text-ink shadow-sm hover:bg-bone transition-colors">
                 2
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-medium border-2 border-ink bg-white text-ink shadow-sm hover:bg-bone transition-colors">
                 3
               </button>
               <span className="text-ink/50 px-2 font-black">...</span>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-medium border-2 border-ink bg-white text-ink shadow-sm hover:bg-bone transition-colors">
                 14
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
