import { z } from 'zod';

const emailSchema = z.string()
  .email('Ungültige E-Mail-Adresse')
  .min(5, 'E-Mail zu kurz')
  .max(255, 'E-Mail zu lang');

const passwordSchema = z.string()
  .min(8, 'Passwort muss mindestens 8 Zeichen lang sein');

const plzSchema = z.string()
  .regex(/^\d{5}$/, 'PLZ muss aus 5 Ziffern bestehen');

// Apotheker-Registrierung
export const pharmacistSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword']
  }
);

// Apotheken-Registrierung
export const pharmacySchema = z.object({
  pharmacyName: z.string().min(3, 'Apothekenname erforderlich'),
  street: z.string().min(3, 'Straße erforderlich'),
  houseNumber: z.string().min(1, 'Hausnummer erforderlich'),
  plz: plzSchema,
  city: z.string().min(2, 'Stadt erforderlich'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword']
  }
);
