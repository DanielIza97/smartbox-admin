'use client';

import Link from 'next/link';
import { PortalPageHero } from '@/components/portal/PortalPageHero';
import { TiltCard } from '@/components/ui/TiltCard';
import { ReservationsContent } from '@/components/reservations/ReservationsContent';

export default function PortalReservationsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-wood-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-wood-500/15 blur-2xl" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <PortalPageHero
          icon="📅"
          title="Mis Reservas"
          subtitle="Tus turnos reservados y su estado."
          action={
            <Link
              href="/portal/classes"
              className="bg-ink-800/60 hover:bg-ink-700/70 text-cream font-semibold px-5 py-2.5 rounded-xl border border-wood-600/40 transition-all text-sm"
            >
              + Nueva reserva
            </Link>
          }
        />

        <TiltCard maxTilt={3} className="rounded-3xl">
          <ReservationsContent canCancel hideHeader />
        </TiltCard>
      </div>
    </div>
  );
}
