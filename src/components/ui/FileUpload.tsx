'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { motion } from 'framer-motion';

interface FileUploadProps {
  accept: string;
  maxSize: number; // in bytes
  onFileSelect: (file: File | null) => void;
  label: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize,
  onFileSelect,
  label,
  required = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(`Datei ist zu groß (max. ${maxSize / 1024 / 1024}MB)`);
      return false;
    }
    
    // e.g. "application/pdf,image/png,image/jpeg"
    const allowedTypes = accept.split(',').map(t => t.trim().toLowerCase());
    
    // Note: Simple mime matching. For robust validation, might need ext checking too.
    if (!allowedTypes.some(type => file.type.toLowerCase().includes(type) || file.type === type || (type === 'image/*' && file.type.startsWith('image/')))) {
      setError(`Dateityp nicht erlaubt. Erlaubte Typen: ${accept}`);
      return false;
    }
    
    return true;
  };

  const handleFile = (selectedFile: File) => {
    setError(null);
    
    if (!validateFile(selectedFile)) {
      setFile(null);
      onFileSelect(null);
      return;
    }
    
    setFile(selectedFile);
    setIsUploading(true);
    setProgress(0);
    
    // Simulate Upload Progress for UX
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (Math.random() * 30);
        if (next >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileSelect(selectedFile);
          toast.success('Datei erfolgreich validiert.');
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white'}
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        {file && !isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-sm font-medium text-slate-900">{file.name}</p>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); removeFile(); }}
              className="mt-2 inline-flex items-center text-xs text-red-600 hover:text-red-800 pointer-events-auto"
            >
              <X className="w-3 h-3 mr-1" /> Entfernen
            </button>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
              <motion.div 
                className="bg-blue-600 h-2 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-slate-600">Lade... {Math.round(progress)}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <UploadCloud className={`mx-auto h-12 w-12 mb-3 ${error ? 'text-red-400' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-slate-700">
              Datei hier ablegen oder klicken
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Erlaubt: {accept} (max. {maxSize / 1024 / 1024}MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};
