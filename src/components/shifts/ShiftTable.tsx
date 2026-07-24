'use client';

import { Shift } from '@/types';

interface ShiftTableProps {
  shifts: Shift[];
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function ShiftTable({ shifts }: ShiftTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-cream">Turnos de trabajo</h2>
        <span className="text-xs font-semibold text-cream-muted uppercase">{shifts.length} Registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-cream-muted">
          <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
            <tr>
              <th className="px-6 py-4">Staff</th>
              <th className="px-6 py-4">Sucursal</th>
              <th className="px-6 py-4">Día</th>
              <th className="px-6 py-4">Desde</th>
              <th className="px-6 py-4">Hasta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {shifts.length > 0 ? (
              shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-ink-950 transition-colors">
                  <td className="px-6 py-4 font-medium text-cream whitespace-nowrap">
                    {shift.staff?.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.location?.name || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{DAYS[shift.dayOfWeek]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.endTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-cream-faint">
                  Todavía no hay turnos de trabajo cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
