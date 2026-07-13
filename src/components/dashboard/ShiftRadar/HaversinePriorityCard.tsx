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
    <div className="bg-ink border-2 border-ink p-5 mb-5 flex gap-4 items-start shadow-[6px_6px_0px_0px_rgba(216,255,58,1)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(216,255,58,1)]">
      
      {/* Brutalist Avatar / Icon block */}
      <div className="w-14 h-14 shrink-0 bg-lime flex items-center justify-center border-2 border-ink">
        <ShieldCheck className="w-8 h-8 text-ink" strokeWidth={2.5} />
      </div>

      <div className="flex-1 font-sans">
        <div className="text-[12px] font-bold uppercase tracking-[1px] text-lime mb-2 font-jetbrains">
          Haversine Priority Match • {matchScore}
        </div>
        <div className="text-[18px] font-black text-bone mb-2 uppercase leading-tight font-sans tracking-wide">
          {title} <span className="font-jetbrains text-lime">({distance})</span>
        </div>
        <a href="#" className="block bg-bone text-ink border-2 border-ink py-2.5 px-4 hover:bg-lime transition-colors group">
          <div className="flex items-center gap-3">
            <div className="text-[14px] flex-1 font-bold line-clamp-2 uppercase">
              {pharmacyName}: <span className="font-instrument italic normal-case text-[16px]">{description}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-ink group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={2.5} />
          </div>
        </a>
      </div>
    </div>
  );
}
