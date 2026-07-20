'use client';

import { PortalNav } from '@/components/portal/PortalNav';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950">
      <PortalNav />
      <main>{children}</main>
    </div>
  );
}
