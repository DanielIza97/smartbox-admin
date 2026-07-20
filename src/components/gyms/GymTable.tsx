'use client';

import Link from 'next/link';
import { Gym } from '@/types';

interface GymTableProps {
  gyms: Gym[];
}

export function GymTable({ gyms }: GymTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-900">Listado de Gimnasios</h2>
        <span className="text-xs font-semibold text-slate-500 uppercase">{gyms.length} Registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Dirección</th>
              <th className="px-6 py-4">Timezone</th>
              <th className="px-6 py-4">Mercado Pago</th>
              <th className="px-6 py-4 text-right">Socios activos</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {gyms.length > 0 ? (
              gyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{gym.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{gym.address || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{gym.timezone}</td>
                  <td className="px-6 py-4">
                    {gym.mercadoPagoUserId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Conectado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Sin conectar
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    {gym.activeMembersCount ?? 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/gyms/${gym.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No hay gimnasios registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
