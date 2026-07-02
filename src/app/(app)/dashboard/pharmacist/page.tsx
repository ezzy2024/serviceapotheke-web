'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { MapPin, Calendar, Clock, Euro, Building, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PharmacistRadar() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const res = await api.get(`/Matching/${user?.id}/matches`);
      setMatches(res.data);
    } catch (error) {
      console.error('Failed to load matches', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    setApplyingJobId(jobId);
    try {
      await api.post(`/Allocation/${jobId}/apply`, {
        pharmacistId: parseInt(user!.id)
      });
      // Remove the job from radar since we applied
      setMatches(prev => prev.filter(m => m.jobPost.id !== jobId));
      // Optionally route to shifts
      // router.push('/dashboard/pharmacist/shifts');
    } catch (error) {
      console.error('Failed to apply', error);
      alert('Bewerbung fehlgeschlagen. Möglicherweise hast du dich bereits beworben oder die Schicht ist nicht mehr verfügbar.');
    } finally {
      setApplyingJobId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center">
            <Search className="w-8 h-8 mr-3 text-indigo-600" /> Schicht-Radar
          </h1>
          <p className="text-slate-500 mt-2">Wir haben {matches.length} passende Vakanzen in deinem Einsatzradius gefunden.</p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Keine Schichten gefunden</h3>
          <p className="text-slate-500 mt-1 max-w-md mx-auto">Aktuell gibt es in deinem Radius (berechnet via Haversine) keine offenen Vakanzen, die zu deinen Kriterien passen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match, idx) => {
            const job = match.jobPost;
            const isApplying = applyingJobId === job.id;
            const startDate = new Date(job.startDate);
            const endDate = new Date(job.endDate);
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={job.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col overflow-hidden"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Match Score: {Math.round(match.score * 100)}%
                    </div>
                    <div className="text-lg font-extrabold text-indigo-600">
                      {job.salary} €/h
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{job.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Building className="w-4 h-4 mr-1" /> {job.pharmacy.pharmacyName}
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {startDate.toLocaleDateString('de-DE')} - {endDate.toLocaleDateString('de-DE')}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      {startDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      ca. {Math.round(match.distanceKm)} km entfernt
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                    <span className="font-semibold">WWS:</span> {job.requiredSoftware}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => handleApply(job.id)}
                    disabled={isApplying}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isApplying ? 'Wird übermittelt...' : 'Verbindlich bewerben'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
