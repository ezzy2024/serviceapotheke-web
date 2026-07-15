import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Queried strictly within Next.js Server Actions
);

export type ActiveMedication = {
  pzn: string;
  atcCodes: string[];
};

export async function validateMedicationSafety(medications: ActiveMedication[]) {
  // Extract all distinct ATC codes present in the patient's decrypted payload
  const distinctAtcs = Array.from(new Set(medications.flatMap(m => m.atcCodes)));
  if (distinctAtcs.length <= 1) return { conflicts: [], safe: true };

  // Query cross-interactions for the extracted ATC matrix
  const { data: conflicts } = await supabase
    .from('abdata.interactions')
    .select('trigger_atc, target_atc, severity_level, clinical_consequence')
    .in('trigger_atc', distinctAtcs)
    .in('target_atc', distinctAtcs);

  return {
    conflicts: conflicts || [],
    safe: (conflicts || []).length === 0
  };
}
