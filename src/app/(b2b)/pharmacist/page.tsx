'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { MapPin, Calendar, Clock, Building, Search, ShieldAlert, Euro } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { ComplianceWidget } from '@/components/ui/ComplianceWidget';

export default function PharmacistRadar() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [complianceLock, setComplianceLock] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const res = await api.get(`/Matching/available-shifts`);
      setMatches(res.data);
      setComplianceLock(false);
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.code === 'COMPLIANCE_LOCK') {
        setComplianceLock(true);
      } else {
        toast.error('Schichten konnten nicht geladen werden.');
      }
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
      setMatches(prev => prev.filter(m => m.id !== jobId));
      toast.success('Erfolgreich beworben!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Bewerbung fehlgeschlagen.';
      toast.error(msg);
    } finally {
      setApplyingJobId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl mr-3 shadow-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          Shift-Radar
        </h1>
        <p className="text-slate-500 mt-2">
          Wir haben {matches.length} passende Vakanzen in deinem Einsatzradius (Haversine-Distanz) gefunden.
        </p>
      </div>

      <ComplianceWidget type="pharmacist" data={(user || {}) as any} />

      {complianceLock ? (
        <div className="mt-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-12 text-center border border-red-100 shadow-sm">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-red-100">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Compliance-Sperre Aktiv</h3>
          <p className="text-slate-600 max-w-lg mx-auto mb-6">
            Dein Zugang zum Shift-Radar ist blockiert, da entweder deine Approbationsurkunde noch nicht verifiziert wurde, oder du keinen aktiven AÜG-Vertrag unterzeichnet hast. 
          </p>
          <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg">
            Jetzt Compliance-Daten vervollständigen
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Keine Schichten gefunden</h3>
          <p className="text-slate-500 mt-1 max-w-md mx-auto">
            Aktuell gibt es in deinem Radius keine offenen Vakanzen, die zu deinen Kriterien passen.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((job, idx) => {
            const isApplying = applyingJobId === job.id;
            const startDate = job.startTime ? new Date(job.startTime) : null;
            const endDate = job.endTime ? new Date(job.endTime) : null;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={job.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                <div className="p-6 flex-1 pt-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                      {job.distanceKm} km Entfernung
                    </div>
                    <div className="text-lg font-extrabold text-blue-600 flex items-center">
                      {job.hourlyRate} <Euro className="w-4 h-4 ml-1" /> / h
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{job.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Building className="w-4 h-4 mr-1" /> {job.pharmacy.name}
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {startDate ? startDate.toLocaleDateString('de-DE') : 'TBA'} 
                      {endDate && startDate?.getTime() !== endDate.getTime() ? ` - ${endDate.toLocaleDateString('de-DE')}` : ''}
                    </div>
                    {startDate && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        {startDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr
                      </div>
                    )}
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {job.pharmacy.postalCode} {job.pharmacy.city}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => handleApply(job.id)}
                    disabled={isApplying}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition-all shadow-md disabled:opacity-50"
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
