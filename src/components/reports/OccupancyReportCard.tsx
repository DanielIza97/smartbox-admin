'use client';

import { OccupancyReport } from '@/types';

interface OccupancyReportCardProps {
  report: OccupancyReport | null;
}

function formatSlot(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const day = start.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' });
  const startTime = start.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${startTime} a ${endTime}`;
}

export function OccupancyReportCard({ report }: OccupancyReportCardProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900">Ocupación</h2>
        {report && (
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Promedio: {(report.averageOccupancyRate * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Clase</th>
              <th className="px-6 py-4">Turno</th>
              <th className="px-6 py-4">Ocupación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report && report.slots.length > 0 ? (
              report.slots.map((slot, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{slot.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatSlot(slot.startAt, slot.endAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {slot.booked} / {slot.capacity} ({(slot.occupancyRate * 100).toFixed(0)}%)
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                  No hay turnos en el rango seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
