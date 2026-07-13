'use client';

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function HaversinePriorityCard({
  pharmacyName = "Adler Apotheke",
  distance = "1.2 km",
  matchScore = "99%",
  title = "Urlaubsvertretung gesucht",
  description = "Perfektes Match! Diese Apotheke sucht eine Urlaubsvertretung und nutzt CGM Lauer, was mit Ihrem Profil übereinstimmt."
}) {
  return (
    <div className="bg-gradient-to-br from-[#1A3A2E] to-[#0E2018] rounded-[14px] p-4 mb-4 flex gap-3.5 items-start shadow-[0_4px_12px_rgba(26,31,48,0.10),0_2px_4px_rgba(26,31,48,0.06)]">
      
      {/* Avatar / Icon */}
      <div className="w-11 h-11 shrink-0 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
        <ShieldCheck className="w-5 h-5 text-white/90" />
      </div>

      <div className="flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#6EE4A6] mb-1">
          Haversine Priority Match • {matchScore}
        </div>
        <div className="text-[13px] font-semibold text-white mb-1.5 leading-snug">
          {title} ({distance})
        </div>
        <a href="#" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md py-2 px-2.5 hover:bg-white/10 transition-colors group">
          <div className="text-xs text-white/85 flex-1 font-medium line-clamp-2">
            {pharmacyName}: {description}
          </div>
          <ArrowRight className="w-4 h-4 text-[#6EE4A6] group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
