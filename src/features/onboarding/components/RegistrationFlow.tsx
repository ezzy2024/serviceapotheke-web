import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pharmacyRegistrationSchema, PharmacyRegistrationData } from '../schemas/validationSchemas';
import { FileUpload } from '@/components/ui/FileUpload';

export const RegistrationFlow: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PharmacyRegistrationData>({
    resolver: zodResolver(pharmacyRegistrationSchema),
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [documentFile, setDocumentFile] = React.useState<File | null>(null);

  const onSubmit = async (data: PharmacyRegistrationData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      if (documentFile) {
        formData.append('documentFile', documentFile);
      }
      // Import api at top or use fetch. Since we don't know if api is imported, use fetch.
      const response = await fetch('/api/Pharmacy/register', {
        method: 'POST',
        body: formData,
        // No Content-Type header so the browser sets the multipart/form-data boundary automatically.
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      // Successfully registered.
      window.location.href = '/dashboard/pharmacy';
    } catch (err: any) {
      setError(err.message || 'Registrierung fehlgeschlagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md animate-in fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Apotheke & Freelancer Registrierung</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Apothekenname</label>
          <input
            {...register('pharmacyName')}
              className={`w-full p-2 border rounded text-slate-900 bg-white focus:border-blue-500 focus:ring-blue-500 ${errors.pharmacyName ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.pharmacyName && <span className="text-red-500 text-sm">{errors.pharmacyName.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">E-Mail</label>
            <input
              {...register('email')}
              className={`w-full p-2 border rounded text-slate-900 bg-white focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Telefon</label>
            <input
              {...register('phone')}
              className={`w-full p-2 border rounded text-slate-900 bg-white focus:border-blue-500 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-slate-700">Straße & Hausnummer</label>
            <input
              {...register('street')}
              className={`w-full p-2 border rounded text-slate-900 bg-white focus:border-blue-500 focus:ring-blue-500 ${errors.street ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.street && <span className="text-red-500 text-sm">{errors.street.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">PLZ</label>
            <input
              {...register('zipCode')}
              className={`w-full p-2 border rounded text-slate-900 bg-white focus:border-blue-500 focus:ring-blue-500 ${errors.zipCode ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.zipCode && <span className="text-red-500 text-sm">{errors.zipCode.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Approbationsnummer (für Apotheker)</label>
            <input
              {...register('approbationNumber')}
              placeholder="Ggf. freilassen falls Apotheke"
              className={`w-full p-2 border rounded text-slate-900 bg-white focus:border-blue-500 focus:ring-blue-500 ${errors.approbationNumber ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.approbationNumber && <span className="text-red-500 text-sm">{errors.approbationNumber.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Betriebserlaubnisnummer (für Apotheken)</label>
            <input
              {...register('betriebserlaubnisNumber')}
              placeholder="Ggf. freilassen falls Apotheker"
              className={`w-full p-2 border rounded text-slate-900 bg-white focus:border-blue-500 focus:ring-blue-500 ${errors.betriebserlaubnisNumber ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.betriebserlaubnisNumber && <span className="text-red-500 text-sm">{errors.betriebserlaubnisNumber.message}</span>}
          </div>
        </div>

        <div className="mt-4">
          <FileUpload
            accept="application/pdf,image/jpeg,image/png"
            maxSize={10 * 1024 * 1024}
            label="Approbationsurkunde / Betriebserlaubnis hochladen"
            onFileSelect={(f) => setDocumentFile(f)}
          />
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2 text-slate-900">Freelancer Compliance</h3>
          <label className="flex items-start gap-2">
            <input type="checkbox" {...register('freelanceCompliance')} className="mt-1" />
            <span className="text-sm text-slate-700">
              Ich bestätige, dass der Einsatz ausschließlich als freier Mitarbeiter (Honorarvertretung) erfolgt. Dies stellt ausdrücklich keine Arbeitnehmerüberlassung dar.
            </span>
          </label>
          {errors.freelanceCompliance && <span className="text-red-500 text-sm block mt-1">{errors.freelanceCompliance.message}</span>}
        </div>

        <button disabled={isSubmitting} type="submit" className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          {isSubmitting ? 'Wird registriert...' : 'Registrierung abschließen'}
        </button>
        {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
};
