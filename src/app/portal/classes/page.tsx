'use client';

import { PortalPageHero } from '@/components/portal/PortalPageHero';
import { TiltCard } from '@/components/ui/TiltCard';
import { ClassesSection } from '@/components/classes/ClassesSection';
import { useAuth } from '@/context/AuthContext';

export default function PortalClassesPage() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-wood-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-wood-500/15 blur-2xl" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <PortalPageHero icon="🧘" title="Clases" subtitle="Turnos recurrentes semanales de tu gimnasio." />

        {!user?.gymId ? (
          <div className="bg-ink-850/90 rounded-3xl border border-ink-line-strong shadow-xl p-6 text-cream-muted">
            Tu cuenta no está asociada a ningún gimnasio.
          </div>
        ) : (
          <TiltCard maxTilt={3} className="rounded-3xl">
            <ClassesSection gymId={user.gymId} canManage={false} detailBasePath="/portal/classes" />
          </TiltCard>
        )}
      </div>
    </div>
  );
}
