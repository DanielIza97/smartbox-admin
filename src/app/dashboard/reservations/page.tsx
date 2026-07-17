'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/ui/sidebar';
import { ReservationTable } from '@/components/reservations/ReservationTable';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Reservation } from '@/types';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/reservations');
      setReservations(res.ok ? await res.json() : []);
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const canCancel = user?.role === 'CLIENT' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.role === 'CLIENT' ? 'Mis reservas' : 'Reservas'}
              </h1>
              <p className="text-slate-500 text-sm">
                {user?.role === 'CLIENT'
                  ? 'Tus turnos reservados y su estado.'
                  : 'Reservas de tu gimnasio.'}
              </p>
            </div>
            {user?.role === 'CLIENT' && (
              <Link
                href="/dashboard/classes"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
              >
                + Nueva reserva
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">Cargando datos...</div>
          ) : (
            <ReservationTable
              reservations={reservations}
              canCancel={canCancel}
              onCancelled={(updated) =>
                setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
