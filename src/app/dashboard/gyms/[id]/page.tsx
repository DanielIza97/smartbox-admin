'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/ui/sidebar';
import { MercadoPagoConnectionCard } from '@/components/gyms/MercadoPagoConnectionCard';
import { PlansSection } from '@/components/plans/PlansSection';
import { ClassesSection } from '@/components/classes/ClassesSection';
import { ShiftsSection } from '@/components/shifts/ShiftsSection';
import { ReportsSection } from '@/components/reports/ReportsSection';
import { apiFetch } from '@/lib/api';
import { Gym } from '@/types';

export default function GymDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadGym = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/gyms/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setGym(data);
    } catch (error) {
      console.error('Error al cargar el gimnasio:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadGym();
  }, [id, loadGym]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-5xl">
          <Link
            href="/dashboard/gyms"
            className="text-sm font-medium text-cream-muted hover:text-cream-muted mb-6 inline-block"
          >
            ← Volver a Gimnasios
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-cream-muted">
              Cargando datos...
            </div>
          ) : notFound || !gym ? (
            <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6 text-cream-muted">
              Gimnasio no encontrado.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
                <h1 className="text-2xl font-bold text-cream">{gym.name}</h1>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-cream-faint uppercase text-xs font-semibold">Dirección</dt>
                    <dd className="text-cream-muted mt-1">{gym.address || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-cream-faint uppercase text-xs font-semibold">Timezone</dt>
                    <dd className="text-cream-muted mt-1">{gym.timezone}</dd>
                  </div>
                </dl>
              </div>

              <MercadoPagoConnectionCard
                gymId={gym.id}
                connected={!!gym.mercadoPagoUserId}
                canConnect
              />

              <PlansSection
                gymId={gym.id}
                canManage
                mercadoPagoConnected={!!gym.mercadoPagoUserId}
              />

              <ClassesSection gymId={gym.id} canManage />

              <ShiftsSection gymId={gym.id} canManage />

              <ReportsSection gymId={gym.id} canViewRevenue />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
