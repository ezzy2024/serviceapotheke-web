import { z } from 'zod';

export const pharmacyRegistrationSchema = z.object({
  pharmacyName: z.string().min(3, 'Apothekenname muss mindestens 3 Zeichen lang sein'),
  ownerName: z.string().min(3, 'Inhabername wird benötigt'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().min(5, 'Gültige Telefonnummer erforderlich'),
  street: z.string().min(3, 'Straße erforderlich'),
  zipCode: z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern enthalten'),
  city: z.string().min(2, 'Stadt erforderlich'),
  augCompliance: z.boolean().refine(val => val === true, 'AÜG-Compliance muss bestätigt werden'),
  searchRadiusKm: z.number().min(1, 'Suchradius muss mindestens 1 km betragen').max(100, 'Maximal 100 km Suchradius'),
});

export type PharmacyRegistrationData = z.infer<typeof pharmacyRegistrationSchema>;

export const jobPostingSchema = z.object({
  title: z.string().min(5, 'Titel muss mindestens 5 Zeichen lang sein'),
  description: z.string().min(20, 'Beschreibung muss detailliert sein (min. 20 Zeichen)'),
  shiftStart: z.string().refine(val => !isNaN(Date.parse(val)), 'Gültiges Startdatum erforderlich'),
  shiftEnd: z.string().refine(val => !isNaN(Date.parse(val)), 'Gültiges Enddatum erforderlich'),
  hourlyRate: z.number().min(30, 'Mindeststundensatz ist 30€'),
  requiredWws: z.enum(['Awinta', 'CGM Lauer', 'Pharmatechnik', 'Sanitas', 'Keine', 'Andere']),
});

export type JobPostingData = z.infer<typeof jobPostingSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];

export const pdlIngestionSchema = z.object({
  file: z.any()
    .refine((file) => file !== null && file !== undefined, 'Excel-Datei erforderlich.')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Maximal zulässige Dateigröße ist 5MB.')
    .refine(
      (file) => ACCEPTED_EXCEL_TYPES.includes(file?.type),
      'Nur Excel-Dateien (.xlsx, .xls) werden unterstützt.'
    ),
});

export type PdlIngestionData = z.infer<typeof pdlIngestionSchema>;
