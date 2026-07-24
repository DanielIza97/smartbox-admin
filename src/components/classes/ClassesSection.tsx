'use client';

import { useCallback, useEffect, useState } from 'react';
import { ClassTable } from './ClassTable';
import { CreateClassModal } from './CreateClassModal';
import { apiFetch } from '@/lib/api';
import { ClassOrResource, Location } from '@/types';

interface ClassesSectionProps {
  gymId: string;
  // Solo SUPER_ADMIN/ADMIN pueden crear clases — mismos roles que POST
  // /classes en el backend.
  canManage: boolean;
  // Portal de socios (E6-02) embebe esta sección fuera de /dashboard.
  detailBasePath?: string;
}

export function ClassesSection({ gymId, canManage, detailBasePath }: ClassesSectionProps) {
  const [classes, setClasses] = useState<ClassOrResource[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // GET /classes trae todas las del gimnasio para SUPER_ADMIN y solo las
  // propias para ADMIN/STAFF/CLIENT — filtrar por gymId acá cubre ambos
  // casos sin necesitar un GET /classes?gymId en el backend (mismo truco
  // que PlansSection con /plans).
  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/classes');
      const data: ClassOrResource[] = res.ok ? await res.json() : [];
      setClasses(
        data
          .filter((c) => c.gymId === gymId)
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)),
      );
    } catch (error) {
      console.error('Error al cargar las clases:', error);
    } finally {
      setLoading(false);
    }
  }, [gymId]);

  // Sucursales del gym — se usan tanto para el selector del modal de alta
  // (canManage) como para el filtro de la tabla (visible para cualquier
  // rol, incluido CLIENT en /portal/classes).
  const loadLocations = useCallback(async () => {
    try {
      const res = await apiFetch('/locations');
      const data: Location[] = res.ok ? await res.json() : [];
      setLocations(data.filter((l) => l.gymId === gymId));
    } catch (error) {
      console.error('Error al cargar las sucursales:', error);
    }
  }, [gymId]);

  useEffect(() => {
    loadClasses();
    loadLocations();
  }, [loadClasses, loadLocations]);

  const visibleClasses = locationFilter
    ? classes.filter((c) => c.locationId === locationFilter)
    : classes;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {locations.length > 1 ? (
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/25 focus:border-neon-400"
          >
            <option value="">Todas las sucursales</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        ) : (
          <div />
        )}

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
          >
            + Nueva clase
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-cream-muted">Cargando clases...</div>
      ) : (
        <ClassTable classes={visibleClasses} detailBasePath={detailBasePath} />
      )}

      <CreateClassModal
        isOpen={isModalOpen}
        gymId={gymId}
        locationOptions={locations}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(cls) => {
          // POST /classes no devuelve la relación location — la completamos
          // acá con lo que ya tenemos en locations, mismo truco que
          // ShiftsSection con staff/location.
          const location = locations.find((l) => l.id === cls.locationId);
          const withLocation = location ? { ...cls, location: { id: location.id, name: location.name } } : cls;
          setClasses((prev) =>
            [...prev, withLocation].sort(
              (a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime),
            ),
          );
        }}
      />
    </div>
  );
}
