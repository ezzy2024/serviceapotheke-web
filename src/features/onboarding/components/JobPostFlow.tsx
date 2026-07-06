import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobPostingSchema, JobPostingData } from '../schemas/validationSchemas';

export const JobPostFlow: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobPostingData>({
    resolver: zodResolver(jobPostingSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: JobPostingData) => {
    console.log('Job Post dispatch:', data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md animate-in fade-in">
      <h2 className="text-2xl font-bold mb-6">Neuen Dienst ausschreiben</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Diensttitel</label>
          <input
            {...register('title')}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="z.B. Notdienst am Wochenende"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Detaillierte Beschreibung</label>
          <textarea
            {...register('description')}
            rows={4}
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Besondere Anforderungen oder Aufgaben..."
          ></textarea>
          {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Startzeitpunkt</label>
            <input
              type="datetime-local"
              {...register('shiftStart')}
              className={`w-full p-2 border rounded ${errors.shiftStart ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.shiftStart && <span className="text-red-500 text-sm">{errors.shiftStart.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Endzeitpunkt</label>
            <input
              type="datetime-local"
              {...register('shiftEnd')}
              className={`w-full p-2 border rounded ${errors.shiftEnd ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.shiftEnd && <span className="text-red-500 text-sm">{errors.shiftEnd.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stundensatz (€)</label>
            <input
              type="number"
              {...register('hourlyRate', { valueAsNumber: true })}
              className={`w-full p-2 border rounded ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.hourlyRate && <span className="text-red-500 text-sm">{errors.hourlyRate.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Erforderliches WWS</label>
            <select
              {...register('requiredWws')}
              className={`w-full p-2 border rounded ${errors.requiredWws ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="Keine">Keine Vorkenntnisse zwingend</option>
              <option value="Awinta">Awinta</option>
              <option value="CGM Lauer">CGM Lauer</option>
              <option value="Pharmatechnik">Pharmatechnik</option>
              <option value="Sanitas">Sanitas</option>
              <option value="Andere">Andere</option>
            </select>
            {errors.requiredWws && <span className="text-red-500 text-sm">{errors.requiredWws.message}</span>}
          </div>
        </div>

        <button type="submit" className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
          Ausschreibung veröffentlichen
        </button>
      </form>
    </div>
  );
};
