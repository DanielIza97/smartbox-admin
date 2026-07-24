'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
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

interface ClassDetailContentProps {
  classId: string;
  // Portal de socios (E6-02) reusa este contenido fuera de /dashboard —
  // los links de "volver" y "ver mis reservas" necesitan su propia base.
  classesHref: string;
  reservationsHref: string;
}

export function ClassDetailContent({ classId, classesHref, reservationsHref }: ClassDetailContentProps) {
  const { user } = useAuth();
  const [cls, setCls] = useState<ClassOrResource | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reservingSlot, setReservingSlot] = useState<string | null>(null);
  const [joiningWaitlistSlot, setJoiningWaitlistSlot] = useState<string | null>(null);
  const [joinedWaitlist, setJoinedWaitlist] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [classRes, availabilityRes] = await Promise.all([
        apiFetch(`/classes/${classId}`),
        apiFetch(`/classes/${classId}/availability`),
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
  }, [classId]);

  useEffect(() => {
    if (classId) loadData();
  }, [classId, loadData]);

  const handleReserve = async (slot: AvailabilitySlot) => {
    setReservingSlot(slot.startAt);
    setMessage(null);
    try {
      const res = await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ classId, startAt: slot.startAt }),
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

  // Lista de espera (Fase 1) — solo aplica cuando el turno está lleno; si
  // hay cupo, WaitlistService.join lo rechaza explícitamente y le pide al
  // socio reservar directo, así que el botón ni se ofrece en ese caso.
  const handleJoinWaitlist = async (slot: AvailabilitySlot) => {
    setJoiningWaitlistSlot(slot.startAt);
    setMessage(null);
    try {
      const res = await apiFetch('/waitlist', {
        method: 'POST',
        body: JSON.stringify({ classId, startAt: slot.startAt }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Te anotamos en la lista de espera.' });
        setJoinedWaitlist((prev) => new Set(prev).add(slot.startAt));
      } else {
        setMessage({ type: 'error', text: data.message || 'No se pudo anotar en la lista de espera.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión.' });
    } finally {
      setJoiningWaitlistSlot(null);
    }
  };

  return (
    <>
      <Link
        href={classesHref}
        className="text-sm font-medium text-cream-muted hover:text-cream-muted mb-6 inline-block"
      >
        ← Volver a Clases
      </Link>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-cream-muted">Cargando datos...</div>
      ) : notFound || !cls ? (
        <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6 text-cream-muted">
          Clase no encontrada.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
            <h1 className="text-2xl font-bold text-cream">{cls.name}</h1>
            <p className="text-sm text-cream-muted mt-1">
              Todas las semanas los {DAYS[cls.dayOfWeek]} a las {cls.startTime} ({cls.durationMinutes} min,
              cupo {cls.capacity})
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-success-bg border border-success/30 text-success'
                  : 'bg-pop-bg border border-pop/30 text-pop'
              }`}
            >
              {message.text}
              {message.type === 'success' && (
                <>
                  {' '}
                  <Link href={reservationsHref} className="underline font-semibold">
                    Ver mis reservas
                  </Link>
                </>
              )}
            </div>
          )}

          <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50">
              <h2 className="text-base font-bold text-cream">Próximos turnos</h2>
            </div>
            <div className="divide-y divide-ink-line">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <div key={slot.startAt} className="px-6 py-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-cream font-medium">{formatSlot(slot.startAt, slot.endAt)}</p>
                      <p className="text-cream-faint text-xs mt-0.5">
                        {slot.available} de {slot.capacity} cupos disponibles
                      </p>
                    </div>
                    {user?.role === 'CLIENT' && slot.available > 0 && (
                      <button
                        onClick={() => handleReserve(slot)}
                        disabled={reservingSlot === slot.startAt}
                        className="bg-wood-600 hover:bg-wood-500 disabled:opacity-50 disabled:cursor-not-allowed text-cream font-semibold px-4 py-2 rounded-xl shadow-sm transition-all text-xs"
                      >
                        {reservingSlot === slot.startAt ? 'Reservando...' : 'Reservar'}
                      </button>
                    )}
                    {user?.role === 'CLIENT' && slot.available === 0 && (
                      <button
                        onClick={() => handleJoinWaitlist(slot)}
                        disabled={
                          joiningWaitlistSlot === slot.startAt || joinedWaitlist.has(slot.startAt)
                        }
                        className="bg-ink-800 hover:bg-ink-700 border border-ink-line-strong disabled:opacity-60 disabled:cursor-not-allowed text-cream font-semibold px-4 py-2 rounded-xl shadow-sm transition-all text-xs"
                      >
                        {joinedWaitlist.has(slot.startAt)
                          ? 'Anotado en lista de espera'
                          : joiningWaitlistSlot === slot.startAt
                            ? 'Anotando...'
                            : 'Anotarme en lista de espera'}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-cream-faint">
                  No hay turnos disponibles en los próximos días.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
