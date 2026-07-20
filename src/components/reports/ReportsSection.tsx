'use client';

import { useCallback, useEffect, useState } from 'react';
import { OccupancyReportCard } from './OccupancyReportCard';
import { RevenueReportCard } from './RevenueReportCard';
import { apiFetch } from '@/lib/api';
import { OccupancyReport, RevenueReport } from '@/types';

interface ReportsSectionProps {
  gymId: string;
  // GET /reports/revenue es solo ADMIN/SUPER_ADMIN en el backend — STAFF
  // puede ver ocupación pero no ingresos.
  canViewRevenue: boolean;
}

export function ReportsSection({ gymId, canViewRevenue }: ReportsSectionProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [occupancy, setOccupancy] = useState<OccupancyReport | null>(null);
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Sin from/to, el backend usa su propio default (últimos 7 días) — no
  // los mandamos hasta que el usuario elija un rango explícito.
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ gymId });
      if (from) params.set('from', from);
      if (to) params.set('to', to);

      const requests = [apiFetch(`/reports/occupancy?${params.toString()}`)];
      if (canViewRevenue) {
        requests.push(apiFetch(`/reports/revenue?${params.toString()}`));
      }
      const [occupancyRes, revenueRes] = await Promise.all(requests);

      setOccupancy(occupancyRes.ok ? await occupancyRes.json() : null);
      setRevenue(revenueRes && revenueRes.ok ? await revenueRes.json() : null);
    } catch (error) {
      console.error('Error al cargar los reportes:', error);
    } finally {
      setLoading(false);
    }
  }, [gymId, from, to, canViewRevenue]);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gymId, canViewRevenue]);

  return (
    <div className="space-y-4">
      <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-4 py-2 bg-ink-850 border border-ink-line-strong rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neon-400/25 focus:border-neon-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-4 py-2 bg-ink-850 border border-ink-line-strong rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neon-400/25 focus:border-neon-400"
          />
        </div>
        <button
          onClick={loadReports}
          className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
        >
          Aplicar
        </button>
        {occupancy && (
          <span className="text-xs text-cream-faint ml-auto">
            Mostrando {new Date(occupancy.from).toLocaleDateString('es-EC')} a{' '}
            {new Date(occupancy.to).toLocaleDateString('es-EC')}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-cream-muted">Cargando reportes...</div>
      ) : (
        <div className={canViewRevenue ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 items-start' : ''}>
          <OccupancyReportCard report={occupancy} />
          {canViewRevenue && <RevenueReportCard report={revenue} />}
        </div>
      )}
    </div>
  );
}
