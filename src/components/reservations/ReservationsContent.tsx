'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ReservationTable } from './ReservationTable';
import { apiFetch } from '@/lib/api';
import { Reservation } from '@/types';

interface ReservationsContentProps {
  title: string;
  subtitle: string;
  canCancel: boolean;
  // Portal de socios (E6-02): si se pasa, muestra el link "+ Nueva
  // reserva" hacia el catálogo de clases de esa superficie.
  newReservationHref?: string;
}

export function ReservationsContent({ title, subtitle, canCancel, newReservationHref }: ReservationsContentProps) {
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

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm">{subtitle}</p>
        </div>
        {newReservationHref && (
          <Link
            href={newReservationHref}
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
  );
}
