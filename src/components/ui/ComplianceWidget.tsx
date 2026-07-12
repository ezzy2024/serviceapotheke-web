import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

interface ComplianceWidgetProps {
  type: 'pharmacist' | 'pharmacy';
  data: {
    isApprobationVerified?: boolean;
    augContractStatus?: string;
    ustIdValidationStatus?: string;
    hasActiveConsent?: boolean;
  };
}

export const ComplianceWidget = ({ type, data }: ComplianceWidgetProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 flex items-center mb-4">
        <ShieldCheck className="w-5 h-5 mr-2 text-green-600" /> Compliance Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Approbation / License */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
          {data.isApprobationVerified ? (
            <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-slate-700 text-sm">
              {type === 'pharmacist' ? 'Approbationsurkunde' : 'Betriebserlaubnis'}
            </p>
            <p className="text-xs text-slate-500">
              {data.isApprobationVerified ? 'Verifiziert' : 'Ausstehend/Fehlend'}
            </p>
          </div>
        </div>

        {/* AÜG Contract */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
          {data.augContractStatus === 'Signed' ? (
            <FileText className="w-5 h-5 text-green-500 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-slate-700 text-sm">AÜG Rahmenvertrag</p>
            <p className="text-xs text-slate-500">
              {data.augContractStatus === 'Signed' ? 'Unterzeichnet' : data.augContractStatus || 'Nicht initiiert'}
            </p>
          </div>
        </div>

        {/* USt-IdNr */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
          {data.ustIdValidationStatus === 'Valid' ? (
            <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-slate-700 text-sm">VIES USt-IdNr.</p>
            <p className="text-xs text-slate-500">
              {data.ustIdValidationStatus === 'Valid' ? 'Gültig' : data.ustIdValidationStatus || 'Prüfung ausstehend'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
