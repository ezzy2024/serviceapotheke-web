'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Briefcase, Users, AlertTriangle, CheckCircle, Package, ArrowRight, Loader2, Clock, ShieldCheck } from 'lucide-react';
import { ComplianceWidget } from '@/components/ui/ComplianceWidget';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, pendingApplications: 0 });
  const [staffOnDuty, setStaffOnDuty] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for Apotheken OS features
  const inventoryAlerts = [
    { id: 1, name: "Ibuprofen 400mg", stock: 12, zone: "A1 - Freiwahl", status: "critical" },
    { id: 2, name: "Nasenspray Ratiopharm", stock: 24, zone: "A3 - Sichtwahl", status: "warning" },
    { id: 3, name: "Paracetamol 500mg", stock: 18, zone: "B1 - Rezeptur", status: "warning" }
  ];

  const openTasks = [
    { id: 1, title: "BTM-Buchung pr�fen", time: "14:00" },
    { id: 2, title: "K�hlschranktemperatur loggen", time: "16:00" },
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
      <header className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
        <div className="relative z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-2">Apotheken OS</p>
          <h1 className="text-3xl font-extrabold text-slate-800">Command Center</h1>
          <p className="text-slate-500 mt-1">Dein t�glicher �berblick �ber Personal, Vakanzen und Operations.</p>
        </div>
      </header>

      {/* Executive Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/pharmacy/jobs" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{stats.activeJobs}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Offene Vakanzen</p>
        </Link>

        <Link href="/dashboard/pharmacy/jobs" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{stats.pendingApplications}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Neue Bewerbungen</p>
        </Link>

        <Link href="/dashboard/pharmacy/dienstplan" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <CheckCircle className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{staffOnDuty.length}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Personal heute im Dienst</p>
        </Link>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/60 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-red-900 relative z-10">{inventoryAlerts.length}</p>
          <p className="text-sm font-medium text-red-700 mt-1 relative z-10">Inventar Warnungen</p>
          <div className="absolute -bottom-4 -right-4 text-red-500/10">
            <Package className="w-32 h-32" />
          </div>
        </div>
      </div>

      {/* Split-View Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" /> Personal im Dienst
              </h2>
              <Link href="/dashboard/pharmacy/dienstplan" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Dienstplan �ffnen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0 flex-1">
              {staffOnDuty.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {staffOnDuty.map((staff, idx) => (
                    <li key={idx} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{staff.name}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{staff.role}</p>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium border border-blue-100">
                        {staff.time}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <p>Kein Personal f�r heute eingeteilt.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-600" /> Inventar Warnungen
              </h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {inventoryAlerts.map(alert => (
                <li key={alert.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{alert.name}</p>
                    <p className="text-xs text-slate-500">{alert.zone}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    alert.status === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                    {alert.stock} St�ck
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" /> Offene Aufgaben
              </h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {openTasks.map(task => (
                <li key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <p className="font-semibold text-slate-700">{task.title}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-500">{task.time}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Security & Compliance Widget */}
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-sm border border-slate-700 overflow-hidden text-white">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" /> System & Compliance
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-200">ISO 27001 Status</p>
                  <p className="text-xs text-slate-400">ISMS Zertifizierung aktiv</p>
                </div>
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                  Compliant
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-200">Datenschutz & Cookies</p>
                  <p className="text-xs text-slate-400">DSGVO-konforme Caches & E2E</p>
                </div>
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
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
