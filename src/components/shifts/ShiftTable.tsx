'use client';

import { Shift } from '@/types';

interface ShiftTableProps {
  shifts: Shift[];
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function ShiftTable({ shifts }: ShiftTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900">Turnos de trabajo</h2>
        <span className="text-xs font-semibold text-slate-500 uppercase">{shifts.length} Registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Staff</th>
              <th className="px-6 py-4">Día</th>
              <th className="px-6 py-4">Desde</th>
              <th className="px-6 py-4">Hasta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shifts.length > 0 ? (
              shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    {shift.staff?.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{DAYS[shift.dayOfWeek]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.endTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
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
