'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { GymTable } from '@/components/gyms/GymTable';
import { CreateGymModal } from '@/components/gyms/CreateGymModal';
import { apiFetch } from '@/lib/api';
import { Gym } from '@/types';

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [mpFilter, setMpFilter] = useState('ALL');

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

  const filteredGyms = useMemo(() => {
    const term = search.trim().toLowerCase();
    return gyms.filter((g) => {
      const matchesSearch =
        !term ||
        g.name.toLowerCase().includes(term) ||
        (g.address ?? '').toLowerCase().includes(term);
      const matchesMp =
        mpFilter === 'ALL' ||
        (mpFilter === 'CONNECTED' && !!g.mercadoPagoUserId) ||
        (mpFilter === 'DISCONNECTED' && !g.mercadoPagoUserId);
      return matchesSearch && matchesMp;
    });
  }, [gyms, search, mpFilter]);

  const filtersActive = search.trim() !== '' || mpFilter !== 'ALL';

  const clearFilters = () => {
    setSearch('');
    setMpFilter('ALL');
  };

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
            <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o dirección..."
                  className="flex-1 min-w-[220px] px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream placeholder:text-cream-faint focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
                />

                <select
                  value={mpFilter}
                  onChange={(e) => setMpFilter(e.target.value)}
                  className="px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
                >
                  <option value="ALL">Mercado Pago: todos</option>
                  <option value="CONNECTED">Conectado</option>
                  <option value="DISCONNECTED">Sin conectar</option>
                </select>

                {filtersActive && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-cream-muted hover:text-cream transition-colors px-2"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <GymTable
                gyms={filteredGyms}
                emptyMessage={
                  filtersActive ? 'Ningún gimnasio coincide con los filtros aplicados.' : undefined
                }
              />
            </>
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
