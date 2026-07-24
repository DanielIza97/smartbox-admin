'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { WaitlistEntry } from '@/types';

function formatSlot(startAt: string) {
  const start = new Date(startAt);
  const day = start.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = start.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${time}`;
}

// Lista de espera de clases (Fase 1) — solo tiene sentido para el propio
// CLIENT, que es el único rol que puede anotarse (POST /waitlist es
// @Roles('CLIENT')). Se anota desde ClassDetailContent cuando un turno
// está lleno.
export function MyWaitlistSection() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/waitlist/me');
      setEntries(res.ok ? await res.json() : []);
    } catch (err) {
      console.error('Error al cargar la lista de espera:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLeave = async (id: string) => {
    setLeavingId(id);
    setError('');
    try {
      const res = await apiFetch(`/waitlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'No se pudo salir de la lista de espera.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setLeavingId(null);
    }
  };

  if (loading || entries.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850 mb-4">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50">
        <h2 className="text-base font-bold text-cream">Lista de espera</h2>
      </div>

      {error && <div className="p-4 bg-pop-bg text-pop text-sm">{error}</div>}

      <div className="divide-y divide-ink-line">
        {entries.map((entry) => (
          <div key={entry.id} className="px-6 py-4 flex items-center justify-between text-sm">
            <div>
              <p className="text-cream font-medium">{entry.classOrResource?.name || '—'}</p>
              <p className="text-cream-faint text-xs mt-0.5">{formatSlot(entry.startAt)}</p>
            </div>
            <button
              onClick={() => handleLeave(entry.id)}
              disabled={leavingId === entry.id}
              className="text-pop hover:text-pop disabled:opacity-70 font-semibold transition-colors text-xs"
            >
              {leavingId === entry.id ? 'Saliendo...' : 'Salir de la lista'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
