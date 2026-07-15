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
        className="fixed bottom-6 right-6 z-50 bg-lime text-ink border-2 border-ink shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] px-4 py-2 font-bricolage font-bold hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(12,20,16,1)] transition-all"
      >
        Legal Updates ({updates.length})
      </button>

      {/* Reel Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm">
          <div className="bg-bone border-4 border-ink w-full max-w-sm h-[60vh] flex flex-col relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(216,255,58,1)]">
            
            <div className="flex justify-between items-center border-b-4 border-ink p-4 bg-lime">
              <h3 className="font-bricolage font-black uppercase text-xl">Compliance Feed</h3>
              <button onClick={() => setIsOpen(false)} className="font-jetbrains font-bold text-xl leading-none">&times;</button>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center relative">
              {updates.map((update, index) => (
                <div 
                  key={update.id}
                  className={`absolute inset-0 p-8 flex flex-col justify-center transition-opacity duration-500 ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <span className="inline-block bg-ink text-bone font-jetbrains text-xs px-2 py-1 uppercase w-fit mb-4">
                    {update.topic}
                  </span>
                  <a href={update.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    <h4 className="font-bricolage text-3xl font-bold leading-tight mb-4 text-ink">
                      {update.title}
                    </h4>
                  </a>
                  <div className="font-jetbrains text-sm text-ink/70 mt-auto">
                    <p>Source: {update.source}</p>
                    <p>Date: {update.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Indicators */}
            <div className="flex border-t-4 border-ink">
              {updates.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-2 flex-1 border-r-2 last:border-r-0 border-ink ${index === activeIndex ? 'bg-persimmon' : 'bg-bone'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
