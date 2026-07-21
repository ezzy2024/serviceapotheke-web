'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Briefcase, Users, AlertTriangle, CheckCircle, Package, ArrowRight, Loader2, Clock, ShieldCheck } from 'lucide-react';
import { ComplianceWidget } from '@/components/ui/ComplianceWidget';
import { NewsWidget } from '@/components/dashboard/NewsWidget';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, pendingApplications: 0 });
  const [staffOnDuty, setStaffOnDuty] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for Apotheken OS features
  const openTasks = [
    { id: 1, title: "BTM-Buchung prüfen", time: "14:00" },
    { id: 2, title: "Kühlschranktemperatur loggen", time: "16:00" },
    { id: 3, title: "Rezeptur Salbe anfertigen", time: "17:30" }
  ];

  useEffect(() => {
    if (user?.id) {
      const fetchDashboardData = async () => {
        try {
          // 1. Fetch Jobs
          const jobsRes = await api.get(`/Job/pharmacy/${user.id}`);
          const jobs = jobsRes.data;
          const active = jobs.filter((j: any) => j.status === 'Active').length;
          const pending = jobs.reduce((acc: number, j: any) => 
            acc + (j.jobApplications?.filter((a: any) => a.status === 'Pending').length || 0), 0);
          setStats({ activeJobs: active, pendingApplications: pending });

          // 2. Fetch Dienstplan for today
          const today = new Date().toISOString().split('T')[0];
          const [empRes, shiftRes] = await Promise.all([
            api.get(`/Dienstplan/pharmacy/${user.id}/employees`),
            api.get(`/Dienstplan/pharmacy/${user.id}/shifts?start=${today}&end=${today}`)
          ]);

          const employees = empRes.data;
          const shifts = shiftRes.data;

          const staffToday = shifts.map((s: any) => {
            const emp = employees.find((e: any) => e.id === s.pharmacyEmployeeId);
            return {
              id: s.id,
              name: emp ? `${emp.firstName} ${emp.lastName}` : 'Unbekannt',
              role: emp ? emp.role : '',
              time: `${s.startTime.substring(0,5)} - ${s.endTime.substring(0,5)}`
            };
          });

          setStaffOnDuty(staffToday);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <ComplianceWidget type="pharmacy" data={(user || {}) as any} />

      {/* Header */}
      <header className="bg-white p-8 border border-slate-200 shadow-lg rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 border border-slate-200"></div>
        <div className="relative z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-slate-800 mb-2">Apotheken OS</p>
          <h1 className="text-4xl font-bold text-slate-800 uppercase tracking-tight">Command Center</h1>
          <p className="text-slate-600 font-semibold mt-1">Dein täglicher Überblick über Personal, Vakanzen und Operations.</p>
        </div>
      </header>

      {/* Executive Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/pharmacy/jobs" className="bg-white p-6 border border-slate-200 shadow-md rounded-xl hover:-translate-y-1 hover:shadow-md rounded-2xl transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 border border-slate-200">
              <Briefcase className="w-6 h-6 text-slate-800" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-800">{stats.activeJobs}</p>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-800 mt-2">Offene Vakanzen</p>
        </Link>

        <Link href="/dashboard/pharmacy/jobs" className="bg-white p-6 border border-slate-200 shadow-md rounded-xl hover:-translate-y-1 hover:shadow-md rounded-2xl transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 border border-slate-200">
              <Users className="w-6 h-6 text-slate-800" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-800">{stats.pendingApplications}</p>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-800 mt-2">Neue Bewerbungen</p>
        </Link>

        <Link href="/dashboard/pharmacy/dienstplan" className="bg-white p-6 border border-slate-200 shadow-md rounded-xl hover:-translate-y-1 hover:shadow-md rounded-2xl transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 border border-slate-200">
              <CheckCircle className="w-6 h-6 text-slate-800" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-800">{staffOnDuty.length}</p>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-800 mt-2">Personal im Dienst</p>
        </Link>

      </div>

      {/* Split-View Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" /> Personal im Dienst
              </h2>
              <Link href="/dashboard/pharmacy/dienstplan" className="text-sm font-semibold text-slate-800 hover:underline flex items-center gap-1">
                Dienstplan ffnen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0 flex-1 bg-white">
              {staffOnDuty.length > 0 ? (
                <ul className="divide-y-2 divide-ink">
                  {staffOnDuty.map((staff, idx) => (
                    <li key={idx} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{staff.name}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{staff.role}</p>
                      </div>
                      <div className="bg-blue-600 text-white px-3 py-1 text-sm font-bold tracking-wide border border-slate-200">
                        {staff.time}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center text-slate-800 font-bold">
                  <p>Kein Personal für heute eingeteilt.</p>
                </div>
              )}
            </div>
          </section>
        </div>
            {/* Right Column */}
        <div className="space-y-8 flex flex-col h-[800px]">
          <div className="flex-1 min-h-0">
            <NewsWidget />
          </div>
          
          <section className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden shrink-0">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Clock className="w-6 h-6" /> Offene Aufgaben
              </h2>
            </div>
            <ul className="divide-y-2 divide-ink">
              {openTasks.map(task => (
                <li key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center bg-white">
                  <div className="flex items-center gap-3">
                    <input id={`task-${task.id}`} type="checkbox" className="w-5 h-5 border border-slate-200 text-slate-800 focus:ring-ink rounded-xl bg-white" />
                    <label htmlFor={`task-${task.id}`} className="font-bold text-slate-800 cursor-pointer">{task.title}</label>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{task.time}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Security & Compliance Widget */}
          <section className="bg-blue-600 border border-slate-200 shadow-lg rounded-2xl overflow-hidden text-white">
            <div className="p-6 border-b-2 border-bone/30 flex justify-between items-center bg-blue-600">
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-400" /> System & Compliance
              </h2>
            </div>
            <div className="p-6 space-y-4">

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Datenschutz & Cookies</p>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-wide mt-1">DSGVO-konforme Caches & E2E</p>
                </div>
                <div className="bg-emerald-50 text-slate-800 px-3 py-1 font-bold text-xs uppercase tracking-wide border-2 border-green-400">
                  Gesichert
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
