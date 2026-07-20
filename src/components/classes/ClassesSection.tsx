'use client';

import { useCallback, useEffect, useState } from 'react';
import { ClassTable } from './ClassTable';
import { CreateClassModal } from './CreateClassModal';
import { apiFetch } from '@/lib/api';
import { ClassOrResource } from '@/types';

interface ClassesSectionProps {
  gymId: string;
  // Solo SUPER_ADMIN/ADMIN pueden crear clases — mismos roles que POST
  // /classes en el backend.
  canManage: boolean;
}

export function ClassesSection({ gymId, canManage }: ClassesSectionProps) {
  const [classes, setClasses] = useState<ClassOrResource[]>([]);
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

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
          >
            + Nueva clase
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">Cargando clases...</div>
      ) : (
        <ClassTable classes={classes} />
      )}

      <CreateClassModal
        isOpen={isModalOpen}
        gymId={gymId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(cls) => setClasses((prev) => [...prev, cls].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)))}
      />
    </div>
  );
}
