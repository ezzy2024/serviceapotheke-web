'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { fetchLegalFeed, LegalUpdate } from '@/app/actions/fetchLegalFeed';

export default function ComplianceReel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [updates, setUpdates] = useState<LegalUpdate[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch updates on mount based on current route
    fetchLegalFeed(pathname).then(data => {
      setUpdates(data);
    });
  }, [pathname]);

  useEffect(() => {
    if (!isOpen || updates.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % updates.length);
    }, 5000); // Rotates every 5 seconds like a reel
    return () => clearInterval(interval);
  }, [isOpen, updates]);

  if (updates.length === 0) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg px-6 py-3 font-semibold hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
      >
        Legal Updates ({updates.length})
      </button>

      {/* Reel Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm h-[60vh] flex flex-col relative overflow-hidden shadow-2xl border border-slate-100">
            
            <div className="flex justify-between items-center border-b border-slate-100 p-5 bg-slate-50/80">
              <h3 className="font-bold text-slate-800 text-lg">Compliance Feed</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center relative bg-white">
              {updates.map((update, index) => (
                <div 
                  key={update.id}
                  className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-500 ${index === activeIndex ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 z-0 translate-x-8'}`}
                >
                  <span className="inline-block bg-blue-50 text-blue-600 font-semibold text-xs px-3 py-1.5 rounded-full w-fit mb-4">
                    {update.topic}
                  </span>
                  <a href={update.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    <h4 className="text-2xl font-bold leading-tight mb-4 text-slate-900">
                      {update.title}
                    </h4>
                  </a>
                  <div className="text-sm font-medium text-slate-500 mt-auto">
                    <p>Source: {update.source}</p>
                    <p>Date: {update.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-1.5 p-4 bg-white justify-center">
              {updates.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
