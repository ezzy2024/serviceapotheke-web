export default function InvoicesPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Rechnungen</h1>
        <p className="text-slate-600">Übersicht aller eingehenden Rechnungen von Honorarvertretern.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Keine Rechnungen vorhanden</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Es wurden noch keine Schichten über ServiceApotheke abgewickelt. Sobald ein Freelancer eine Schicht abgeschlossen hat, findest du hier die Rechnungen.
        </p>
      </div>
    </div>
  );
}
