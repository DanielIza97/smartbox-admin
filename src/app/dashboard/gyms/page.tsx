'use client';

import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { GymTable } from '@/components/gyms/GymTable';
import { CreateGymModal } from '@/components/gyms/CreateGymModal';
import { apiFetch } from '@/lib/api';
import { Gym } from '@/types';

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadGyms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/gyms');
      const data = await res.json();
      setGyms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar gimnasios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGyms();
  }, [loadGyms]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-cream">Gimnasios</h1>
              <p className="text-cream-muted text-sm">Clientes del SaaS — acá los que se dieron de alta manual; los gimnasios que se registraron solos vía /signup-gym también aparecen listados.</p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <span>🏢+</span> Dar de alta gimnasio
            </button>
          </div>

          {loading && gyms.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-cream-muted">
              Cargando datos...
            </div>
          ) : (
            <GymTable gyms={gyms} />
          )}
        </div>
      </main>

      <CreateGymModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadGyms}
      />
    </div>
  );
}
