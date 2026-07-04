'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, pendingApplications: 0, totalSpend: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`/Job/pharmacy/${user.id}`).then(res => {
        const jobs = res.data;
        const active = jobs.filter((j: any) => j.status === 'Active').length;
        const pending = jobs.reduce((acc: number, j: any) => 
          acc + (j.jobApplications?.filter((a: any) => a.status === 'Pending').length || 0), 0);
        setStats(s => ({ ...s, activeJobs: active, pendingApplications: pending }));
      }).catch(err => console.error(err))
      .finally(() => setIsLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Apotheken Administrator</h2>
        <p className="text-slate-500">Willkommen in deinem Dashboard. Hier verwaltest du Vakanzen und Stundenzettel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 bg-blue-50/30">
          <h3 className="font-semibold text-blue-900">Offene Schichten</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {isLoading ? '...' : stats.activeJobs}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 bg-green-50/30">
          <h3 className="font-semibold text-green-900">Ausstehende Freigaben</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {isLoading ? '...' : stats.pendingApplications}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 bg-purple-50/30">
          <h3 className="font-semibold text-purple-900">Gesamtausgaben</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {isLoading ? '...' : `€${stats.totalSpend.toLocaleString('de-DE')}`}
          </p>
        </div>
      </div>
    </div>
  );
}
