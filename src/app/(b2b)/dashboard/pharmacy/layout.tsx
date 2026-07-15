import React from 'react';
import ComplianceReel from '@/components/dashboard/ComplianceReel';

export default function PharmacyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ComplianceReel />
    </>
  );
}
