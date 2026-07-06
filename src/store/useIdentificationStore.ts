import { create } from 'zustand';

export type WorkflowState = 'IDLE' | 'PHARMACY_REGISTRATION' | 'JOB_POSTING' | 'PDL_INGESTION';

interface IdentificationState {
  workflow: WorkflowState;
  setWorkflow: (workflow: WorkflowState) => void;
  resetWorkflow: () => void;
}

export const useIdentificationStore = create<IdentificationState>((set) => ({
  workflow: 'IDLE',
  setWorkflow: (workflow) => set({ workflow }),
  resetWorkflow: () => set({ workflow: 'IDLE' }),
}));
