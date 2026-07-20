'use client';

import { useCallback, useEffect, useState } from 'react';
import { MembershipStatusCard } from '@/components/memberships/MembershipStatusCard';
import { InvoiceTable } from '@/components/memberships/InvoiceTable';
import { apiFetch } from '@/lib/api';
import { Membership, Invoice, Plan } from '@/types';

export default function PortalMembershipPage() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [membershipRes, invoicesRes, plansRes] = await Promise.all([
        apiFetch('/memberships/me'),
        apiFetch('/memberships/me/invoices'),
        apiFetch('/plans'),
      ]);

      setMembership(membershipRes.status === 404 ? null : await membershipRes.json());
      setInvoices(invoicesRes.ok ? await invoicesRes.json() : []);
      setPlans(plansRes.ok ? await plansRes.json() : []);
    } catch (error) {
      console.error('Error al cargar la membresía:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi membresía</h1>
        <p className="text-slate-500 text-sm">Estado de tu suscripción y tu historial de facturas.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">Cargando datos...</div>
      ) : (
        <>
          <MembershipStatusCard membership={membership} plans={plans} onChange={setMembership} />
          <InvoiceTable invoices={invoices} />
        </>
      )}
    </div>
  );
}
