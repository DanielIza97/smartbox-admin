'use client';

import { ReservationsContent } from '@/components/reservations/ReservationsContent';

export default function PortalReservationsPage() {
  return (
    <ReservationsContent
      title="Mis reservas"
      subtitle="Tus turnos reservados y su estado."
      canCancel
      newReservationHref="/portal/classes"
    />
  );
}
