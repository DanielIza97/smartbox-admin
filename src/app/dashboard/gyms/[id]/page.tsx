'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/ui/sidebar';
import { MercadoPagoConnectionCard } from '@/components/gyms/MercadoPagoConnectionCard';
import { PlanCard } from '@/components/plans/PlanCard';
import { ClassesSection } from '@/components/classes/ClassesSection';
import { apiFetch } from '@/lib/api';
import { Gym, Plan } from '@/types';

export default function GymDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [gym, setGym] = useState<Gym | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
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

      // GET /plans le devuelve TODOS los planes a un SUPER_ADMIN (sin scope
      // de gym) — no hay un GET /plans?gymId todavía, así que filtramos acá.
      const plansRes = await apiFetch('/plans');
      const plans: Plan[] = plansRes.ok ? await plansRes.json() : [];
      setPlan(plans.find((p) => p.gymId === id) ?? null);
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-3xl">
          <Link
            href="/dashboard/gyms"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 mb-6 inline-block"
          >
            ← Volver a Gimnasios
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              Cargando datos...
            </div>
          ) : notFound || !gym ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-slate-500">
              Gimnasio no encontrado.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h1 className="text-2xl font-bold text-slate-900">{gym.name}</h1>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-slate-400 uppercase text-xs font-semibold">Dirección</dt>
                    <dd className="text-slate-700 mt-1">{gym.address || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 uppercase text-xs font-semibold">Timezone</dt>
                    <dd className="text-slate-700 mt-1">{gym.timezone}</dd>
                  </div>
                </dl>
              </div>

              <MercadoPagoConnectionCard
                gymId={gym.id}
                connected={!!gym.mercadoPagoUserId}
                canConnect
              />

              <PlanCard
                gymId={gym.id}
                plan={plan}
                canManage
                mercadoPagoConnected={!!gym.mercadoPagoUserId}
                onCreated={setPlan}
              />

              <ClassesSection gymId={gym.id} canManage />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
