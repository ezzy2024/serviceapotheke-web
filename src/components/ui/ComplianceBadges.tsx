export function ComplianceBadge({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col border border-slate-200 bg-white p-4 rounded-xl shadow-sm mb-4 w-full md:w-auto">
      <span className="font-semibold text-xs text-blue-600 mb-1">
        {title}
      </span>
      <span className="text-sm font-medium text-slate-700">
        {description}
      </span>
    </div>
  );
}

export function ComplianceBadgesGroup() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <ComplianceBadge 
        title="100% DSGVO-Konform" 
        description="Data processed locally, zero-knowledge." 
      />
      <ComplianceBadge 
        title="Client-Side E2EE" 
        description="AES-256-GCM encrypted." 
      />
      <ComplianceBadge 
        title="ABDA-Standard pDL" 
        description="Algorithms based on public guidelines." 
      />
    </div>
  );
}
