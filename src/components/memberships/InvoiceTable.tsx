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
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-base font-bold text-slate-900">Historial de facturas</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Fecha de pago</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(invoice.paidAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(invoice.amountCents / 100).toFixed(2)} USD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
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
