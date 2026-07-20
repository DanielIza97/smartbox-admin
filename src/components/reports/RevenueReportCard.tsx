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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Ingresos</h2>
        {report && (
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {report.activeMembersCount} socios activos
          </span>
        )}
      </div>

      {report && (
        <p className="text-3xl font-bold text-slate-900 mb-4">
          ${(report.totalCents / 100).toFixed(2)} USD
        </p>
      )}

      <div className="space-y-2">
        {report && report.days.length > 0 ? (
          report.days.map((day) => (
            <div key={day.date} className="flex justify-between text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">{formatDate(day.date)}</span>
              <span className="font-medium text-slate-900">${(day.totalCents / 100).toFixed(2)} USD</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">
            No hay facturas pagadas en el rango seleccionado.
          </p>
        )}
      </div>
    </div>
  );
}
