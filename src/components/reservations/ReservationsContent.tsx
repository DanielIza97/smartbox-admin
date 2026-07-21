'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ReservationTable, STATUS_LABEL } from './ReservationTable';
import { apiFetch } from '@/lib/api';
import { Reservation } from '@/types';

interface ReservationsContentProps {
  title?: string;
  subtitle?: string;
  canCancel: boolean;
  // Portal de socios (E6-02): si se pasa, muestra el link "+ Nueva
  // reserva" hacia el catálogo de clases de esa superficie.
  newReservationHref?: string;
  // El portal de socios arma su propio encabezado (PortalPageHero) y no
  // necesita el título/subtítulo propios de este componente — solo la
  // tabla.
  hideHeader?: boolean;
}

export function ReservationsContent({
  title,
  subtitle,
  canCancel,
  newReservationHref,
  hideHeader = false,
}: ReservationsContentProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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

  // GET /reservations no tiene paginación ni filtro de fecha en el backend
  // — devuelve el historial completo. Filtramos acá, sobre lo ya cargado,
  // mismo patrón que UsersPage (evita un roundtrip nuevo por cada cambio).
  const filteredReservations = useMemo(() => {
    const term = search.trim().toLowerCase();
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return reservations.filter((r) => {
      const matchesSearch = !term || (r.classOrResource?.name ?? '').toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const startAt = new Date(r.startAt);
      const matchesFrom = !from || startAt >= from;
      const matchesTo = !to || startAt <= to;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [reservations, search, statusFilter, dateFrom, dateTo]);

  const filtersActive =
    search.trim() !== '' || statusFilter !== 'ALL' || dateFrom !== '' || dateTo !== '';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="p-8 max-w-5xl">
      {!hideHeader && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cream">{title}</h1>
            <p className="text-cream-muted text-sm">{subtitle}</p>
          </div>
          {newReservationHref && (
            <Link
              href={newReservationHref}
              className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
            >
              + Nueva reserva
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-cream-muted">Cargando datos...</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por clase..."
              className="flex-1 min-w-[180px] px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream placeholder:text-cream-faint focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
            >
              <option value="ALL">Todos los estados</option>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
            />
            <span className="text-cream-faint text-sm">a</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
            />

            {filtersActive && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-cream-muted hover:text-cream transition-colors px-2"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <ReservationTable
            reservations={filteredReservations}
            canCancel={canCancel}
            emptyMessage={
              filtersActive ? 'Ninguna reserva coincide con los filtros aplicados.' : undefined
            }
            onCancelled={(updated) =>
              setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
            }
          />
        </>
      )}
    </div>
  );
}
