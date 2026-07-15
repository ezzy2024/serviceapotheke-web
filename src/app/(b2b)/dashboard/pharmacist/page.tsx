'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { ShiftSidebarFilters } from '@/components/dashboard/ShiftRadar/ShiftSidebarFilters';
import { ShiftFilterChips } from '@/components/dashboard/ShiftRadar/ShiftFilterChips';
import { HaversinePriorityCard } from '@/components/dashboard/ShiftRadar/HaversinePriorityCard';
import { ShiftCard } from '@/components/dashboard/ShiftRadar/ShiftCard';
import { ComplianceBadgesGroup } from '@/components/ui/ComplianceBadges';
import { LayoutGrid, List } from 'lucide-react';

export default function ShiftRadarPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit',sans-serif]">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 pt-6 flex justify-end">
        <ComplianceBadgesGroup />
      </div>
      {/* Container for the Chips */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 pt-6">
        <ShiftFilterChips />
      </div>

      <main className="max-w-[1320px] mx-auto px-6 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-6 items-start">
        
        {/* Sidebar */}
        <ShiftSidebarFilters />

        {/* Results Area */}
        <div className="min-w-0">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="text-sm text-slate-600">
              {isLoading ? (
                <span>Lade Vakanzen...</span>
              ) : (
                <><strong className="text-slate-900 font-bold">{shifts.length} Vakanzen</strong> für Ihr Profil</>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex border-[1.5px] border-slate-200 rounded-md overflow-hidden">
                <button className="px-2.5 py-1.5 bg-slate-900 flex items-center justify-center transition-colors">
                  <List className="w-4 h-4 text-white" />
                </button>
                <button className="px-2.5 py-1.5 bg-transparent hover:bg-slate-50 flex items-center justify-center transition-colors">
                  <LayoutGrid className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Match */}
          <HaversinePriorityCard />

          <div className="flex items-center gap-2.5 my-5 text-[11px] font-semibold uppercase tracking-[0.6px] text-slate-400">
            <div className="flex-1 h-px bg-slate-200"></div>
            Weitere Vakanzen
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Shift Cards Feed */}
          <div className="flex flex-col gap-2">
            {isLoading ? (
               <div className="text-center py-10 text-slate-500">Lade...</div>
            ) : shifts.length === 0 ? (
               <div className="text-center py-10 text-slate-500 bg-white border border-slate-200 rounded-xl">Keine offenen Schichten gefunden.</div>
            ) : (
              shifts.map((shift: any) => {
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
          <div className="flex justify-center items-center gap-1.5 mt-8">
             <button className="w-9 h-9 flex items-center justify-center rounded-md text-[13px] font-bold border-[1.5px] border-red-600 bg-red-600 text-white shadow-sm">
               1
             </button>
             <button className="w-9 h-9 flex items-center justify-center rounded-md text-[13px] font-medium border-[1.5px] border-slate-200 bg-white text-slate-700 hover:border-red-600 hover:text-red-600 transition-colors">
               2
             </button>
             <button className="w-9 h-9 flex items-center justify-center rounded-md text-[13px] font-medium border-[1.5px] border-slate-200 bg-white text-slate-700 hover:border-red-600 hover:text-red-600 transition-colors">
               3
             </button>
             <span className="text-slate-400 px-1">...</span>
          </div>

        </div>
      </main>
    </div>
  );
}
