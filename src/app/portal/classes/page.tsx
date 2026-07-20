'use client';

import { PortalPageHero } from '@/components/portal/PortalPageHero';
import { TiltCard } from '@/components/ui/TiltCard';
import { ClassesSection } from '@/components/classes/ClassesSection';
import { useAuth } from '@/context/AuthContext';

export default function PortalClassesPage() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 blur-2xl" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <PortalPageHero icon="🧘" title="Clases" subtitle="Turnos recurrentes semanales de tu gimnasio." />

        {!user?.gymId ? (
          <div className="bg-white/85 rounded-3xl border border-white/70 shadow-xl p-6 text-slate-500">
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
