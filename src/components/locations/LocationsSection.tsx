'use client';

import { useCallback, useEffect, useState } from 'react';
import { LocationTable } from './LocationTable';
import { CreateLocationModal } from './CreateLocationModal';
import { apiFetch } from '@/lib/api';
import { Location } from '@/types';

interface LocationsSectionProps {
  gymId: string;
  // Solo SUPER_ADMIN/ADMIN pueden crear sucursales — mismos roles que POST
  // /locations en el backend.
  canManage: boolean;
}

export function LocationsSection({ gymId, canManage }: LocationsSectionProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // GET /locations no filtra por gym para SUPER_ADMIN — filtramos acá,
  // mismo truco que PlansSection/ClassesSection/ShiftsSection.
  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/locations');
      const data: Location[] = res.ok ? await res.json() : [];
      setLocations(data.filter((l) => l.gymId === gymId));
    } catch (error) {
      console.error('Error al cargar las sucursales:', error);
    } finally {
      setLoading(false);
    }
  }, [gymId]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
          >
            + Nueva sucursal
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-cream-muted">Cargando sucursales...</div>
      ) : (
        <LocationTable locations={locations} />
      )}

      <CreateLocationModal
        isOpen={isModalOpen}
        gymId={gymId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(location) => setLocations((prev) => [...prev, location])}
      />
    </div>
  );
}
