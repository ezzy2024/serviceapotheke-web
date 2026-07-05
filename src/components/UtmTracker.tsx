"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UtmTrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmTerm = searchParams.get("utm_term");

    if (utmSource || utmMedium || utmCampaign || utmTerm) {
      const utmData = {
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem("utm_data", JSON.stringify(utmData));
    }
  }, [searchParams]);

  return null;
}

export default function UtmTracker() {
  return (
    <Suspense fallback={null}>
      <UtmTrackerInner />
    </Suspense>
  );
}
