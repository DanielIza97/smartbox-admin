'use client';

import Link from 'next/link';
import { ClassOrResource } from '@/types';

interface ClassTableProps {
  classes: ClassOrResource[];
  // Portal de socios (E6-02) reusa esta tabla fuera de /dashboard — el
  // link de detalle necesita apuntar a su propia base de ruta.
  detailBasePath?: string;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function ClassTable({ classes, detailBasePath = '/dashboard/classes' }: ClassTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-cream">Clases y recursos</h2>
        <span className="text-xs font-semibold text-cream-muted uppercase">{classes.length} Registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-cream-muted">
          <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Día</th>
              <th className="px-6 py-4">Hora</th>
              <th className="px-6 py-4">Duración</th>
              <th className="px-6 py-4">Cupo</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-ink-950 transition-colors group">
                  <td className="px-6 py-4 font-medium text-cream whitespace-nowrap">{cls.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{DAYS[cls.dayOfWeek]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cls.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cls.durationMinutes} min</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cls.capacity}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`${detailBasePath}/${cls.id}`}
                      className="text-neon-400 hover:text-neon-300 font-semibold transition-colors"
                    >
                      Ver disponibilidad
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-cream-faint">
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
