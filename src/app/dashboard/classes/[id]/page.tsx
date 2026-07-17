'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/ui/sidebar';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AvailabilitySlot, ClassOrResource } from '@/types';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function formatSlot(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const day = start.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'short' });
  const startTime = start.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${startTime} a ${endTime}`;
}

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [cls, setCls] = useState<ClassOrResource | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reservingSlot, setReservingSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [classRes, availabilityRes] = await Promise.all([
        apiFetch(`/classes/${id}`),
        apiFetch(`/classes/${id}/availability`),
      ]);
      if (classRes.status === 404) {
        setNotFound(true);
        return;
      }
      const classData = await classRes.json();
      const slotsData: AvailabilitySlot[] = availabilityRes.ok ? await availabilityRes.json() : [];
      setCls(classData);
      setSlots(slotsData);
    } catch (error) {
      console.error('Error al cargar la clase:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  const handleReserve = async (slot: AvailabilitySlot) => {
    setReservingSlot(slot.startAt);
    setMessage(null);
    try {
      const res = await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ classId: id, startAt: slot.startAt }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: '¡Reserva confirmada!' });
        await loadData();
      } else {
        setMessage({ type: 'error', text: data.message || 'No se pudo reservar ese turno.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión.' });
    } finally {
      setReservingSlot(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-3xl">
          <Link
            href="/dashboard/classes"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 mb-6 inline-block"
          >
            ← Volver a Clases
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">Cargando datos...</div>
          ) : notFound || !cls ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-slate-500">
              Clase no encontrada.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h1 className="text-2xl font-bold text-slate-900">{cls.name}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Todas las semanas los {DAYS[cls.dayOfWeek]} a las {cls.startTime} ({cls.durationMinutes} min,
                  cupo {cls.capacity})
                </p>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium ${
                    message.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}
                >
                  {message.text}
                  {message.type === 'success' && (
                    <>
                      {' '}
                      <Link href="/dashboard/reservations" className="underline font-semibold">
                        Ver mis reservas
                      </Link>
                    </>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-base font-bold text-slate-900">Próximos turnos</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {slots.length > 0 ? (
                    slots.map((slot) => (
                      <div
                        key={slot.startAt}
                        className="px-6 py-4 flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="text-slate-900 font-medium">{formatSlot(slot.startAt, slot.endAt)}</p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            {slot.available} de {slot.capacity} cupos disponibles
                          </p>
                        </div>
                        {user?.role === 'CLIENT' && (
                          <button
                            onClick={() => handleReserve(slot)}
                            disabled={slot.available === 0 || reservingSlot === slot.startAt}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-all text-xs"
                          >
                            {reservingSlot === slot.startAt
                              ? 'Reservando...'
                              : slot.available === 0
                                ? 'Sin cupo'
                                : 'Reservar'}
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center text-slate-400">
                      No hay turnos disponibles en los próximos días.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
