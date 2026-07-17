'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { MercadoPagoConnectionCard } from '@/components/gyms/MercadoPagoConnectionCard';
import { PlanCard } from '@/components/plans/PlanCard';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Gym, Plan } from '@/types';

function MercadoPagoStatusBanner() {
  const searchParams = useSearchParams();
  const mercadoPagoStatus = searchParams.get('mercadopago');

  if (mercadoPagoStatus === 'connected') {
    return (
      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
        ✓ Cuenta de Mercado Pago conectada correctamente.
      </div>
    );
  }
  if (mercadoPagoStatus === 'error') {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
        ✕ No se pudo completar la conexión con Mercado Pago. Intentá de nuevo.
      </div>
    );
  }
  return null;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [gym, setGym] = useState<Gym | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGym = useCallback(async () => {
    if (!user?.gymId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await apiFetch(`/gyms/${user.gymId}`);
      const data = await res.json();
      setGym(data);
    } catch (error) {
      console.error('Error al cargar el gimnasio:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.gymId]);

  // GET /plans ya viene scopeado al propio gimnasio para ADMIN/STAFF — a lo
  // sumo un elemento, por el unique en gym_id del backend.
  const loadPlan = useCallback(async () => {
    try {
      const res = await apiFetch('/plans');
      const plans: Plan[] = res.ok ? await res.json() : [];
      setPlan(plans[0] ?? null);
    } catch (error) {
      console.error('Error al cargar el plan:', error);
    }
  }, []);

  useEffect(() => {
    loadGym();
    loadPlan();
  }, [loadGym, loadPlan]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Configuración del gimnasio</h1>
            <p className="text-slate-500 text-sm">Datos y conexión de pagos de tu propio gimnasio.</p>
          </div>

          <Suspense fallback={null}>
            <MercadoPagoStatusBanner />
          </Suspense>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              Cargando datos...
            </div>
          ) : !user?.gymId ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-slate-500">
              Tu cuenta no está asociada a ningún gimnasio.
            </div>
          ) : !gym ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-slate-500">
              No se pudo cargar la información del gimnasio.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-900">{gym.name}</h2>
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
                canConnect={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'}
              />

              <PlanCard
                gymId={gym.id}
                plan={plan}
                canManage={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'}
                mercadoPagoConnected={!!gym.mercadoPagoUserId}
                onCreated={setPlan}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
