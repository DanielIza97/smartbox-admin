'use client';

import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { MercadoPagoConnectionCard } from '@/components/gyms/MercadoPagoConnectionCard';
import { PlansSection } from '@/components/plans/PlansSection';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Gym } from '@/types';

export default function SettingsPage() {
  const { user } = useAuth();
  const [gym, setGym] = useState<Gym | null>(null);
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

  useEffect(() => {
    loadGym();
  }, [loadGym]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-cream">Configuración del gimnasio</h1>
            <p className="text-cream-muted text-sm">Datos y conexión de pagos de tu propio gimnasio.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-cream-muted">
              Cargando datos...
            </div>
          ) : !user?.gymId ? (
            <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6 text-cream-muted">
              Tu cuenta no está asociada a ningún gimnasio.
            </div>
          ) : !gym ? (
            <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6 text-cream-muted">
              No se pudo cargar la información del gimnasio.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
                <h2 className="text-lg font-bold text-cream">{gym.name}</h2>
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
                canConnect={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'}
              />

              <PlansSection
                gymId={gym.id}
                canManage={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'}
                mercadoPagoConnected={!!gym.mercadoPagoUserId}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
