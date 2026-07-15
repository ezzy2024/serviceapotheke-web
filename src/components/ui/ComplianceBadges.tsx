export function ComplianceBadge({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col border-2 border-ink bg-bone p-3 shadow-[4px_4px_0px_0px_rgba(12,20,16,1)] mb-4 w-full md:w-auto">
      <span className="font-jetbrains font-bold uppercase text-xs tracking-wider text-ink mb-1">
        {title}
      </span>
      <span className="font-bricolage text-sm font-semibold text-ink/80">
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
