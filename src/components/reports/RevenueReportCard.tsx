'use client';

import { RevenueReport } from '@/types';

interface RevenueReportCardProps {
  report: RevenueReport | null;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'short',
  });
}

export function RevenueReportCard({ report }: RevenueReportCardProps) {
  return (
    <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-cream">Ingresos</h2>
        {report && (
          <span className="text-xs font-semibold text-cream-muted uppercase">
            {report.activeMembersCount} socios activos
          </span>
        )}
      </div>

      {report && (
        <p className="text-3xl font-bold text-cream mb-4">
          ${(report.totalCents / 100).toFixed(2)} USD
        </p>
      )}

      <div className="space-y-2">
        {report && report.days.length > 0 ? (
          report.days.map((day) => (
            <div key={day.date} className="flex justify-between text-sm border-b border-ink-line pb-2">
              <span className="text-cream-muted">{formatDate(day.date)}</span>
              <span className="font-medium text-cream">${(day.totalCents / 100).toFixed(2)} USD</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-cream-faint text-center py-6">
            No hay facturas pagadas en el rango seleccionado.
          </p>
        )}
      </div>
    </div>
  );
}
