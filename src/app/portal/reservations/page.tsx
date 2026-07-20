'use client';

import Link from 'next/link';
import { PortalPageHero } from '@/components/portal/PortalPageHero';
import { TiltCard } from '@/components/ui/TiltCard';
import { ReservationsContent } from '@/components/reservations/ReservationsContent';

export default function PortalReservationsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 blur-2xl" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <PortalPageHero
          icon="📅"
          title="Mis Reservas"
          subtitle="Tus turnos reservados y su estado."
          action={
            <Link
              href="/portal/classes"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl border border-white/30 transition-all text-sm"
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
