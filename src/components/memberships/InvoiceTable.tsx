'use client';

import { Invoice } from '@/types';

interface InvoiceTableProps {
  invoices: Invoice[];
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
      <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50">
        <h2 className="text-base font-bold text-cream">Historial de facturas</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-cream-muted">
          <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
            <tr>
              <th className="px-6 py-4">Fecha de pago</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-ink-950 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(invoice.paidAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(invoice.amountCents / 100).toFixed(2)} USD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-cream-faint">
                  Todavía no hay facturas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
