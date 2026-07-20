'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { ReservationsContent } from '@/components/reservations/ReservationsContent';
import { useAuth } from '@/context/AuthContext';

export default function ReservationsPage() {
  const { user } = useAuth();
  const canCancel = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <ReservationsContent
          title="Reservas"
          subtitle="Reservas de tu gimnasio."
          canCancel={canCancel}
        />
      </main>
    </div>
  );
}
