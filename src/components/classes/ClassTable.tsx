'use client';

import Link from 'next/link';
import { ClassOrResource } from '@/types';

interface ClassTableProps {
  classes: ClassOrResource[];
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function ClassTable({ classes }: ClassTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900">Clases y recursos</h2>
        <span className="text-xs font-semibold text-slate-500 uppercase">{classes.length} Registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Día</th>
              <th className="px-6 py-4">Hora</th>
              <th className="px-6 py-4">Duración</th>
              <th className="px-6 py-4">Cupo</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{cls.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{DAYS[cls.dayOfWeek]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cls.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cls.durationMinutes} min</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cls.capacity}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/classes/${cls.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                    >
                      Ver disponibilidad
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Todavía no hay clases configuradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
