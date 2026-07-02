import React from 'react';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Impressum</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Angaben gemäß § 5 TMG</h2>
              <p>
                ServiceApotheke GmbH<br />
                Musterstraße 1<br />
                12345 Berlin
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Vertreten durch</h2>
              <p>Max Mustermann (Geschäftsführer)</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Kontakt</h2>
              <p>
                Telefon: +49 (0) 123 44 55 66<br />
                E-Mail: info@serviceapotheke.tech
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Registereintrag</h2>
              <p>
                Eintragung im Handelsregister.<br />
                Registergericht: Amtsgericht Charlottenburg (Berlin)<br />
                Registernummer: HRB 123456 B
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Umsatzsteuer-ID</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                DE 123 456 789
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>
                Max Mustermann<br />
                Musterstraße 1<br />
                12345 Berlin
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
