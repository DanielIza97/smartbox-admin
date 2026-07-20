'use client';

import { useCallback, useEffect, useState } from 'react';
import { PortalPageHero } from '@/components/portal/PortalPageHero';
import { TiltCard } from '@/components/ui/TiltCard';
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 blur-2xl" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <PortalPageHero
          icon="🎫"
          title="Mi Membresía"
          subtitle="Estado de tu suscripción y tu historial de facturas."
        />

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">Cargando datos...</div>
        ) : (
          <>
            <TiltCard className="rounded-3xl">
              <MembershipStatusCard membership={membership} plans={plans} onChange={setMembership} />
            </TiltCard>
            <TiltCard maxTilt={3} className="rounded-3xl">
              <InvoiceTable invoices={invoices} />
            </TiltCard>
          </>
        )}
      </div>
    </div>
  );
}
