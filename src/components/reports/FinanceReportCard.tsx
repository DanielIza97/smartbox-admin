'use client';

import { FinanceReport } from '@/types';

interface FinanceReportCardProps {
  report: FinanceReport | null;
}

function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)} USD`;
}

// MRR/ARR/Churn/LTV (Fase 1) — mismo lenguaje visual que RevenueReportCard,
// sin librería de gráficos (no hay ninguna instalada en el proyecto).
export function FinanceReportCard({ report }: FinanceReportCardProps) {
  return (
    <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-cream">Finanzas</h2>
        {report && (
          <span className="text-xs font-semibold text-cream-muted uppercase">
            {report.activeMembersCount} socios activos
          </span>
        )}
      </div>

      {report ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-cream-faint uppercase tracking-wide">MRR</p>
            <p className="text-2xl font-bold text-cream mt-1">{formatUsd(report.mrrCents)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-cream-faint uppercase tracking-wide">ARR</p>
            <p className="text-2xl font-bold text-cream mt-1">{formatUsd(report.arrCents)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-cream-faint uppercase tracking-wide">Churn</p>
            <p className="text-2xl font-bold text-cream mt-1">
              {(report.churnRate * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-cream-faint mt-0.5">
              {report.cancelledInRangeCount} cancelaciones en el rango
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-cream-faint uppercase tracking-wide">LTV</p>
            <p className="text-2xl font-bold text-cream mt-1">
              {report.ltvCents !== null ? formatUsd(report.ltvCents) : '—'}
            </p>
            {report.ltvCents === null && (
              <p className="text-xs text-cream-faint mt-0.5">Sin datos suficientes</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-cream-faint text-center py-6">Sin datos financieros disponibles.</p>
      )}
    </div>
  );
}
