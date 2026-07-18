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
    <div className="bg-blue-600 border border-blue-500 rounded-2xl p-6 mb-6 flex gap-4 items-start shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
      
      {/* Avatar / Icon block */}
      <div className="w-14 h-14 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm">
        <ShieldCheck className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
      </div>

      <div className="flex-1 font-sans">
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-100 mb-2">
          Haversine Priority Match • {matchScore}
        </div>
        <div className="text-xl font-bold text-white mb-3 leading-tight">
          {title} <span className="text-blue-200">({distance})</span>
        </div>
        <a href="#" className="block bg-white text-slate-800 rounded-xl py-3 px-4 hover:bg-blue-50 transition-colors group shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-sm flex-1 font-semibold line-clamp-2">
              {pharmacyName}: <span className="font-normal">{description}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={2.5} />
          </div>
        </a>
      </div>
    </div>
  );
}
