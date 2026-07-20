'use client';

import { Plan } from '@/types';

interface PlanTableProps {
  plans: Plan[];
}

export function PlanTable({ plans }: PlanTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50 flex justify-between items-center">
        <h2 className="text-base font-bold text-cream">Planes de membresía</h2>
        <span className="text-xs font-semibold text-cream-muted uppercase">{plans.length} Registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-cream-muted">
          <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Precio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-ink-950 transition-colors">
                  <td className="px-6 py-4 font-medium text-cream whitespace-nowrap">{plan.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(plan.priceCents / 100).toFixed(2)} USD / mes
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-cream-faint">
                  Todavía no hay planes configurados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
