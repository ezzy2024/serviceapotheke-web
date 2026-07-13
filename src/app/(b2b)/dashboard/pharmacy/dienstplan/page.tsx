'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, UserPlus, Briefcase, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DienstplanPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Week calculation
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user, currentDate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const startStr = startOfWeek.toISOString().split('T')[0];
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      const endStr = endOfWeek.toISOString().split('T')[0];

      const [empRes, shiftRes] = await Promise.all([
        api.get(`/Dienstplan/pharmacy/${user?.id}/employees`),
        api.get(`/Dienstplan/pharmacy/${user?.id}/shifts?start=${startStr}&end=${endStr}`)
      ]);
      setEmployees(empRes.data);
      setShifts(shiftRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleCreateVacancy = (date: Date) => {
    // Generate JobPost payload mapping to the empty time block
    const dateString = date.toLocaleDateString('de-DE');
    alert(`Konversions-Pipeline ausgelöst!\nLeitet zum Marktplatz weiter, um Freelancer für den ${dateString} zu suchen.\n(Payload: StartTime=08:00, EndTime=18:00, IsEmergency=false)`);
  };

  const handleAddEmployee = async () => {
    const name = prompt("Name des Mitarbeiters:");
    if (!name) return;
    const role = prompt("Rolle (z.B. Apotheker, PTA, PKA):", "PTA");
    
    try {
      await api.post(`/Dienstplan/pharmacy/${user?.id}/employees`, {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        role: role || 'PTA',
        colorCode: '#0ea5e9' // cyan-500
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading && employees.length === 0) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
            Interne Personalplanung
          </h1>
          <p className="text-slate-600">Verwalte dein Stammteam und schreibe unbesetzte Schichten direkt als Vakanz aus.</p>
        </div>
        <button 
          onClick={handleAddEmployee}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4 text-blue-600" /> Mitarbeiter anlegen
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Calendar Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button onClick={prevWeek} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={nextWeek} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition-all"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              KW {getWeekNumber(currentDate)} ({startOfWeek.toLocaleDateString('de-DE')} - {weekDays[6].toLocaleDateString('de-DE')})
            </h2>
          </div>
        </div>

        {/* Weekly Grid View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr>
                <th className="p-4 border-b border-r border-slate-100 bg-slate-50 w-48 font-bold text-slate-700">Mitarbeiter</th>
                {weekDays.map((date, i) => (
                  <th key={i} className="p-4 border-b border-slate-100 bg-slate-50 text-center font-medium text-slate-600 min-w-[140px]">
                    <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">{date.toLocaleDateString('de-DE', { weekday: 'short' })}</div>
                    <div className="text-lg font-bold text-slate-800">{date.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 border-r border-slate-100 bg-white/30">
                    <div className="font-bold text-slate-800">{emp.firstName} {emp.lastName}</div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{emp.role}</div>
                  </td>
                  {weekDays.map((date, i) => {
                    const shift = shifts.find(s => s.pharmacyEmployeeId === emp.id && new Date(s.date).toDateString() === date.toDateString());
                    return (
                      <td key={i} className="p-2 border-r border-slate-50 relative group">
                        {shift ? (
                          <div className={`p-2 rounded-lg text-xs font-medium border border-blue-200 bg-blue-50 text-blue-800`}>
                            {shift.startTime.substring(0,5)} - {shift.endTime.substring(0,5)}
                            {shift.isEmergencyDuty && <div className="mt-1 text-[10px] bg-red-100 text-red-700 px-1 py-0.5 rounded uppercase font-bold inline-block">Notdienst</div>}
                          </div>
                        ) : (
                          <div className="h-full w-full min-h-[48px] rounded-lg border-2 border-dashed border-transparent group-hover:border-slate-200 transition-colors flex items-center justify-center">
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Conversion Pipeline: Unfilled Slots Row */}
              <tr className="bg-slate-50/80">
                <td className="p-4 border-r border-slate-100 font-bold text-slate-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-cyan-600" />
                  Offener Bedarf
                </td>
                {weekDays.map((date, i) => (
                  <td key={i} className="p-3 text-center align-middle">
                    <button 
                      onClick={() => handleCreateVacancy(date)}
                      className="w-full flex flex-col items-center justify-center gap-1 py-3 px-2 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-300 hover:shadow-md rounded-xl transition-all group"
                    >
                      <Briefcase className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-blue-700 leading-tight">Vakanz<br/>ausschreiben</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}
