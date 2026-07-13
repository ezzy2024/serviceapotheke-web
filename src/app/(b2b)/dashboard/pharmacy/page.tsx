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
      <header className="bg-white p-8 border-2 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-bone rounded-full -mr-20 -mt-20 border-4 border-ink"></div>
        <div className="relative z-10">
          <p className="text-sm font-black tracking-widest uppercase text-ink mb-2">Apotheken OS</p>
          <h1 className="text-4xl font-black text-ink uppercase tracking-tight">Command Center</h1>
          <p className="text-ink/80 font-semibold mt-1">Dein tglicher berblick ber Personal, Vakanzen und Operations.</p>
        </div>
      </header>

      {/* Executive Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/pharmacy/jobs" className="bg-white p-6 border-2 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-bone border-2 border-ink">
              <Briefcase className="w-6 h-6 text-ink" />
            </div>
          </div>
          <p className="text-4xl font-black text-ink">{stats.activeJobs}</p>
          <p className="text-sm font-bold uppercase tracking-wide text-ink mt-2">Offene Vakanzen</p>
        </Link>

        <Link href="/dashboard/pharmacy/jobs" className="bg-white p-6 border-2 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-bone border-2 border-ink">
              <Users className="w-6 h-6 text-ink" />
            </div>
          </div>
          <p className="text-4xl font-black text-ink">{stats.pendingApplications}</p>
          <p className="text-sm font-bold uppercase tracking-wide text-ink mt-2">Neue Bewerbungen</p>
        </Link>

        <Link href="/dashboard/pharmacy/dienstplan" className="bg-white p-6 border-2 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-bone border-2 border-ink">
              <CheckCircle className="w-6 h-6 text-ink" />
            </div>
          </div>
          <p className="text-4xl font-black text-ink">{staffOnDuty.length}</p>
          <p className="text-sm font-bold uppercase tracking-wide text-ink mt-2">Personal im Dienst</p>
        </Link>

        <div className="bg-red-400 p-6 border-2 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white border-2 border-ink">
              <AlertTriangle className="w-6 h-6 text-ink" />
            </div>
          </div>
          <p className="text-4xl font-black text-ink relative z-10">{inventoryAlerts.length}</p>
          <p className="text-sm font-bold uppercase tracking-wide text-ink mt-2 relative z-10">Inventar Warnungen</p>
          <div className="absolute -bottom-4 -right-4 text-ink opacity-10">
            <Package className="w-32 h-32" />
          </div>
        </div>
      </div>

      {/* Split-View Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          <section className="bg-white border-2 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b-2 border-ink flex justify-between items-center bg-bone">
              <h2 className="text-xl font-black uppercase tracking-tight text-ink flex items-center gap-2">
                <CheckCircle className="w-6 h-6" /> Personal im Dienst
              </h2>
              <Link href="/dashboard/pharmacy/dienstplan" className="text-sm font-black uppercase tracking-wide text-ink hover:underline flex items-center gap-1">
                Dienstplan ffnen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0 flex-1 bg-white">
              {staffOnDuty.length > 0 ? (
                <ul className="divide-y-2 divide-ink">
                  {staffOnDuty.map((staff, idx) => (
                    <li key={idx} className="p-4 hover:bg-bone transition-colors flex justify-between items-center">
                      <div>
                        <p className="font-black text-ink">{staff.name}</p>
                        <p className="text-xs font-bold text-ink/70 uppercase tracking-wider mt-1">{staff.role}</p>
                      </div>
                      <div className="bg-ink text-bone px-3 py-1 text-sm font-black tracking-wide border-2 border-ink">
                        {staff.time}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center text-ink font-bold">
                  <p>Kein Personal fr heute eingeteilt.</p>
                </div>
              )}
            </div>
          </section>
        </div>
            {/* Right Column */}
        <div className="space-y-8">
          <section className="bg-white border-2 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-6 border-b-2 border-ink flex justify-between items-center bg-red-400">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
                <Package className="w-6 h-6" /> Inventar Warnungen
              </h2>
            </div>
            <ul className="divide-y-2 divide-ink">
              {inventoryAlerts.map(alert => (
                <li key={alert.id} className="p-4 hover:bg-bone transition-colors flex justify-between items-center bg-white">
                  <div>
                    <p className="font-black text-ink">{alert.name}</p>
                    <p className="text-xs font-bold text-ink/70 mt-1 uppercase tracking-wide">{alert.zone}</p>
                  </div>
                  <div className={`px-3 py-1 text-xs font-black uppercase tracking-wide border-2 border-ink ${
                    alert.status === 'critical' ? 'bg-red-400 text-ink' : 'bg-yellow-400 text-ink'
                  }`}>
                    {alert.stock} Stck
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border-2 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-6 border-b-2 border-ink flex justify-between items-center bg-bone">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
                <Clock className="w-6 h-6" /> Offene Aufgaben
              </h2>
            </div>
            <ul className="divide-y-2 divide-ink">
              {openTasks.map(task => (
                <li key={task.id} className="p-4 hover:bg-bone transition-colors flex justify-between items-center bg-white">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 border-2 border-ink text-ink focus:ring-ink rounded-none bg-white" />
                    <p className="font-bold text-ink">{task.title}</p>
                  </div>
                  <p className="text-sm font-black text-ink">{task.time}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Security & Compliance Widget */}
          <section className="bg-ink border-2 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden text-bone">
            <div className="p-6 border-b-2 border-bone/30 flex justify-between items-center bg-ink">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-400" /> System & Compliance
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-black">ISO 27001 Status</p>
                  <p className="text-xs font-bold text-bone/70 uppercase tracking-wide mt-1">ISMS Zertifizierung aktiv</p>
                </div>
                <div className="bg-green-400 text-ink px-3 py-1 font-black text-xs uppercase tracking-wide border-2 border-green-400">
                  Compliant
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-black">Datenschutz & Cookies</p>
                  <p className="text-xs font-bold text-bone/70 uppercase tracking-wide mt-1">DSGVO-konforme Caches & E2E</p>
                </div>
                <div className="bg-green-400 text-ink px-3 py-1 font-black text-xs uppercase tracking-wide border-2 border-green-400">
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
