'use client';

import React from 'react';
import { useIdentificationStore, WorkflowState } from '../store/useIdentificationStore';
import { RegistrationFlow } from '../features/onboarding/components/RegistrationFlow';
import { JobPostFlow } from '../features/onboarding/components/JobPostFlow';
import { PdlIngestionFlow } from '../features/onboarding/components/PdlIngestionFlow';

export default function Home() {
  const { workflow, setWorkflow } = useIdentificationStore();

  if (workflow === 'IDLE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
            Wählen Sie Ihren Workflow
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <button 
              onClick={() => setWorkflow('PHARMACY_REGISTRATION')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center border border-gray-100 hover:border-blue-500 group"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Registrierung</h2>
              <p className="text-gray-500 text-sm">Apotheke registrieren oder als Freelancer anmelden (AÜG Check & Routing).</p>
            </button>

            <button 
              onClick={() => setWorkflow('JOB_POSTING')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center border border-gray-100 hover:border-green-500 group"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Dienst ausschreiben</h2>
              <p className="text-gray-500 text-sm">Notdienste oder Vertretungen inserieren (Schichtplanung & WWS).</p>
            </button>

            <button 
              onClick={() => setWorkflow('PDL_INGESTION')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center border border-gray-100 hover:border-purple-500 group"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">pDL Ingestion</h2>
              <p className="text-gray-500 text-sm">Pharmazentrische Dienstleistungen hochladen (MiniExcel Parser).</p>
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => setWorkflow('IDLE')}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zur Auswahl
        </button>
      </div>

      {workflow === 'PHARMACY_REGISTRATION' && <RegistrationFlow />}
      {workflow === 'JOB_POSTING' && <JobPostFlow />}
      {workflow === 'PDL_INGESTION' && <PdlIngestionFlow />}
    </div>
  );
}
