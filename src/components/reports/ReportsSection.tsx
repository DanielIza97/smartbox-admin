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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>
        <button
          onClick={loadReports}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
        >
          Aplicar
        </button>
        {occupancy && (
          <span className="text-xs text-slate-400 ml-auto">
            Mostrando {new Date(occupancy.from).toLocaleDateString('es-EC')} a{' '}
            {new Date(occupancy.to).toLocaleDateString('es-EC')}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">Cargando reportes...</div>
      ) : (
        <div className={canViewRevenue ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 items-start' : ''}>
          <OccupancyReportCard report={occupancy} />
          {canViewRevenue && <RevenueReportCard report={revenue} />}
        </div>
      )}
    </div>
  );
}
