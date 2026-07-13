import { ShiftSidebarFilters } from '@/components/dashboard/ShiftRadar/ShiftSidebarFilters';
import { ShiftFilterChips } from '@/components/dashboard/ShiftRadar/ShiftFilterChips';
import { HaversinePriorityCard } from '@/components/dashboard/ShiftRadar/HaversinePriorityCard';
import { ShiftCard } from '@/components/dashboard/ShiftRadar/ShiftCard';
import { LayoutGrid, List } from 'lucide-react';

export default function ShiftRadarPage() {
  // Mock payload mimicking the MatchingController output
  const shifts = [
    {
      pharmacyName: "Stadt-Apotheke München",
      initials: "SAM",
      title: "Notdienstvertretung gesucht (Nachtschicht)",
      description: "Wir suchen eine zuverlässige Vertretung für den kommenden Notdienst. WWS: CGM Lauer. Erfahrung vorausgesetzt.",
      hourlyRate: "120,00",
      dates: ["14. Aug 2026", "15. Aug 2026"],
      distance: "4.5 km",
      rating: "4.8",
      reviews: "12",
      isSponsored: true
    },
    {
      pharmacyName: "Apotheke am Markt",
      initials: "AAM",
      title: "Urlaubsvertretung für 2 Wochen",
      description: "Freundliches Team sucht Unterstützung während der Sommerferien. Flexible Arbeitszeiten nach Absprache möglich.",
      hourlyRate: "95,00",
      dates: ["01. Sep - 14. Sep 2026"],
      distance: "12.8 km",
      rating: "4.5",
      reviews: "8",
      isSponsored: false
    },
    {
      pharmacyName: "Paracelsus Apotheke",
      initials: "PAR",
      title: "Krankheitsausfall: Kurzfristige Vertretung",
      description: "Dringend! Wir benötigen heute Nachmittag und morgen Unterstützung am HV. ADG Kenntnisse von Vorteil.",
      hourlyRate: "110,00",
      dates: ["Heute, 14:00 - 18:00"],
      distance: "2.1 km",
      rating: "5.0",
      reviews: "34",
      isSponsored: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit',sans-serif]">
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
              <strong className="text-slate-900 font-bold">142 Vakanzen</strong> für Ihr Profil
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
            {shifts.map((shift, idx) => (
              <ShiftCard key={idx} {...shift} />
            ))}
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
             <button className="w-9 h-9 flex items-center justify-center rounded-md text-[13px] font-medium border-[1.5px] border-slate-200 bg-white text-slate-700 hover:border-red-600 hover:text-red-600 transition-colors">
               14
             </button>
          </div>

        </div>
      </main>
    </div>
  );
}
