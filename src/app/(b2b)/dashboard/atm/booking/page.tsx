'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle } from 'lucide-react';

export default function AtmBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  // Stub slots
  const slots = [
    { id: 1, time: '09:00', available: true },
    { id: 2, time: '09:30', available: false },
    { id: 3, time: '10:00', available: true },
    { id: 4, time: '10:30', available: true },
    { id: 5, time: '11:00', available: false },
    { id: 6, time: '11:30', available: true },
  ];

  const handleBooking = async () => {
    if (!selectedSlot) return;
    // Call AtmSchedulingController here
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Termin gebucht!</h1>
        <p className="text-slate-600 max-w-md">
          Ihr Telemedizin-Termin (aTM) wurde erfolgreich gebucht. Sie erhalten in Kürze eine E-Mail mit dem Link zum virtuellen Wartezimmer.
        </p>
        <button 
          onClick={() => setIsBooked(false)}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Weiteren Termin buchen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Video className="w-6 h-6 text-blue-600" />
          Telemedizin (aTM) Termin vereinbaren
        </h1>
        <p className="text-slate-600 mt-2">
          Wählen Sie einen passenden Zeitpunkt für Ihre telepharmazeutische Beratung.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Col: Calendar (Stub) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            Datum wählen
          </h2>
          {/* Simple Date Picker Stub */}
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
              <div key={d} className="text-xs font-medium text-slate-400">{d}</div>
            ))}
            {/* Mocking a few days */}
            {Array.from({ length: 30 }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setSelectedDate(new Date(new Date().setDate(new Date().getDate() + i)))}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  i === 0 
                    ? 'bg-blue-600 text-white font-semibold' 
                    : i % 7 === 5 || i % 7 === 6 
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'hover:bg-slate-100 text-slate-700'
                }`}
                disabled={i % 7 === 5 || i % 7 === 6}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Time Slots */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Uhrzeit wählen
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {slots.map(slot => (
              <button
                key={slot.id}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  !slot.available 
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed line-through decoration-slate-300'
                    : selectedSlot === slot.id
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleBooking}
              disabled={!selectedSlot}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition shadow-sm"
            >
              Termin bestätigen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
