'use client';

import Link from 'next/link';
import { Gym } from '@/types';

interface GymTableProps {
  gyms: Gym[];
  emptyMessage?: string;
}

export function GymTable({ gyms, emptyMessage }: GymTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-cream">Listado de Gimnasios</h2>
        <span className="text-xs font-semibold text-cream-muted uppercase">{gyms.length} Registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-cream-muted">
          <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Dirección</th>
              <th className="px-6 py-4">Timezone</th>
              <th className="px-6 py-4">Mercado Pago</th>
              <th className="px-6 py-4 text-right">Socios activos</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {gyms.length > 0 ? (
              gyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-ink-950 transition-colors group">
                  <td className="px-6 py-4 font-medium text-cream whitespace-nowrap">{gym.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{gym.address || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{gym.timezone}</td>
                  <td className="px-6 py-4">
                    {gym.mercadoPagoUserId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success-bg border border-success/30 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-success rounded-full" /> Conectado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warn bg-warn-bg border border-warn/30 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-warn rounded-full" /> Sin conectar
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-cream">
                    {gym.activeMembersCount ?? 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/gyms/${gym.id}`}
                      className="text-neon-400 hover:text-neon-300 font-semibold transition-colors"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-cream-faint">
                  {emptyMessage ?? 'No hay gimnasios registrados todavía.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
