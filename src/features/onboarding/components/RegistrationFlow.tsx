import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pharmacyRegistrationSchema, PharmacyRegistrationData } from '../schemas/validationSchemas';

export const RegistrationFlow: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PharmacyRegistrationData>({
    resolver: zodResolver(pharmacyRegistrationSchema),
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

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
      <h2 className="text-2xl font-bold mb-6">Apotheke & Freelancer Registrierung</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Apothekenname</label>
          <input
            {...register('pharmacyName')}
            className={`w-full p-2 border rounded ${errors.pharmacyName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.pharmacyName && <span className="text-red-500 text-sm">{errors.pharmacyName.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-Mail</label>
            <input
              {...register('email')}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              {...register('phone')}
              className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Straße & Hausnummer</label>
            <input
              {...register('street')}
              className={`w-full p-2 border rounded ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.street && <span className="text-red-500 text-sm">{errors.street.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PLZ</label>
            <input
              {...register('zipCode')}
              className={`w-full p-2 border rounded ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.zipCode && <span className="text-red-500 text-sm">{errors.zipCode.message}</span>}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">AÜG Compliance</h3>
          <label className="flex items-start gap-2">
            <input type="checkbox" {...register('augCompliance')} className="mt-1" />
            <span className="text-sm">
              Ich bestätige, dass ich die Richtlinien des Arbeitnehmerüberlassungsgesetzes (AÜG) zur Kenntnis genommen habe.
            </span>
          </label>
          {errors.augCompliance && <span className="text-red-500 text-sm block mt-1">{errors.augCompliance.message}</span>}
        </div>

        <button disabled={isSubmitting} type="submit" className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          {isSubmitting ? 'Wird registriert...' : 'Registrierung abschließen'}
        </button>
        {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
};
