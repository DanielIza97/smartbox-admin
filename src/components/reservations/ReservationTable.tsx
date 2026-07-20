'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ConfirmationModal } from '../ui/ConfirmationModel';
import { Reservation } from '@/types';

interface ReservationTableProps {
  reservations: Reservation[];
  // CLIENT cancela las propias; ADMIN/SUPER_ADMIN las de su gimnasio (ya
  // vienen pre-scopeadas por el backend en GET /reservations). STAFF puede
  // ver la lista pero no cancelar — @Roles('CLIENT','ADMIN','SUPER_ADMIN')
  // en POST /reservations/:id/cancel.
  canCancel: boolean;
  onCancelled: (reservation: Reservation) => void;
}

const STATUS_LABEL: Record<Reservation['status'], string> = {
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  expired: 'Vencida',
};

const STATUS_STYLE: Record<Reservation['status'], string> = {
  confirmed: 'text-success bg-success-bg border-success/30',
  cancelled: 'text-cream-muted bg-ink-800 border-ink-line-strong',
  expired: 'text-cream-faint bg-ink-950 border-ink-line-strong',
};

function formatSlot(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const day = start.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
  const startTime = start.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${startTime} a ${endTime}`;
}

export function ReservationTable({ reservations, canCancel, onCancelled }: ReservationTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Reservation | null>(null);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    if (!confirmTarget) return;
    const target = confirmTarget;
    setConfirmTarget(null);
    setCancellingId(target.id);
    setError('');
    try {
      const res = await apiFetch(`/reservations/${target.id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        onCancelled(data);
      } else {
        setError(data.message || 'No se pudo cancelar la reserva.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50">
        <h2 className="text-base font-bold text-cream">Reservas</h2>
      </div>

      {error && <div className="p-4 bg-pop-bg text-pop text-sm">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-cream-muted">
          <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
            <tr>
              <th className="px-6 py-4">Clase</th>
              <th className="px-6 py-4">Horario</th>
              <th className="px-6 py-4">Estado</th>
              {canCancel && <th className="px-6 py-4 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {reservations.length > 0 ? (
              reservations.map((r) => (
                <tr key={r.id} className="hover:bg-ink-950 transition-colors">
                  <td className="px-6 py-4 font-medium text-cream whitespace-nowrap">
                    {r.classOrResource?.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatSlot(r.startAt, r.endAt)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1 rounded-full ${STATUS_STYLE[r.status]}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  {canCancel && (
                    <td className="px-6 py-4 text-right">
                      {r.status === 'confirmed' && (
                        <button
                          onClick={() => setConfirmTarget(r)}
                          disabled={cancellingId === r.id}
                          className="text-pop hover:text-pop disabled:opacity-70 font-semibold transition-colors"
                        >
                          {cancellingId === r.id ? 'Cancelando...' : 'Cancelar'}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canCancel ? 4 : 3} className="px-6 py-12 text-center text-cream-faint">
                  Todavía no hay reservas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!confirmTarget}
        title="Cancelar reserva"
        message="¿Confirmás que querés cancelar esta reserva?"
        onConfirm={handleCancel}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
