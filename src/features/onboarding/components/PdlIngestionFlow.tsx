import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pdlIngestionSchema, PdlIngestionData } from '../schemas/validationSchemas';

export const PdlIngestionFlow: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PdlIngestionData>({
    resolver: zodResolver(pdlIngestionSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PdlIngestionData) => {
    console.log('pDL File ready for ingestion:', data.file.name);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setValue('file', e.dataTransfer.files[0], { shouldValidate: true });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setValue('file', e.target.files[0], { shouldValidate: true });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md animate-in fade-in">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">pDL (MiniExcel) Upload</h2>
      <p className="text-slate-600 mb-6 text-sm">
        Bitte laden Sie Ihre ausgefüllte MiniExcel pDL-Tabelle hier hoch. Unser System extrahiert automatisch die relevanten Pharmazentrischen Dienstleistungen für die Abrechnung.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div 
          className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors 
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            ${errors.file ? 'border-red-500 bg-red-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-slate-600">Excel-Datei hierher ziehen oder klicken</p>
            <p className="text-xs text-slate-600 mt-1">.xlsx, .xls bis zu 5MB</p>
          </div>
        </div>
        
        {errors.file && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{errors.file.message as string}</span>
          </div>
        )}

        <button type="submit" className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
          Dokument analysieren
        </button>
      </form>
    </div>
  );
};
