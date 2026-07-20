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
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-cream">Ocupación</h2>
        {report && (
          <span className="text-xs font-semibold text-cream-muted uppercase">
            Promedio: {(report.averageOccupancyRate * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-cream-muted">
          <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
            <tr>
              <th className="px-6 py-4">Clase</th>
              <th className="px-6 py-4">Turno</th>
              <th className="px-6 py-4">Ocupación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {report && report.slots.length > 0 ? (
              report.slots.map((slot, idx) => (
                <tr key={idx} className="hover:bg-ink-950 transition-colors">
                  <td className="px-6 py-4 font-medium text-cream whitespace-nowrap">{slot.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatSlot(slot.startAt, slot.endAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {slot.booked} / {slot.capacity} ({(slot.occupancyRate * 100).toFixed(0)}%)
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-cream-faint">
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
