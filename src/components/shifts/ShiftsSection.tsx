'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShiftTable } from './ShiftTable';
import { CreateShiftModal } from './CreateShiftModal';
import { apiFetch } from '@/lib/api';
import { Shift, User } from '@/types';

interface ShiftsSectionProps {
  gymId: string;
  // Solo SUPER_ADMIN/ADMIN pueden crear turnos — mismos roles que POST
  // /shifts en el backend.
  canManage: boolean;
}

function roleName(user: User): string {
  return typeof user.role === 'object' && user.role !== null ? user.role.name : user.role;
}

export function ShiftsSection({ gymId, canManage }: ShiftsSectionProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [staffOptions, setStaffOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // GET /shifts no filtra por gym para SUPER_ADMIN — filtramos acá por
  // staff.gym.id, mismo truco que PlansSection/ClassesSection con /plans y
  // /classes (no hay un GET /shifts?gymId en el backend).
  const loadShifts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/shifts');
      const data: Shift[] = res.ok ? await res.json() : [];
      setShifts(
        data
          .filter((s) => s.staff?.gym?.id === gymId)
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)),
      );
    } catch (error) {
      console.error('Error al cargar los turnos:', error);
    } finally {
      setLoading(false);
    }
  }, [gymId]);

  const loadStaff = useCallback(async () => {
    if (!canManage) return;
    try {
      const res = await apiFetch('/users');
      const data: User[] = res.ok ? await res.json() : [];
      setStaffOptions(
        data.filter((u) => roleName(u) === 'STAFF' && u.gym?.id === gymId),
      );
    } catch (error) {
      console.error('Error al cargar el staff:', error);
    }
  }, [gymId, canManage]);

  useEffect(() => {
    loadShifts();
    loadStaff();
  }, [loadShifts, loadStaff]);

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
          >
            + Nuevo turno
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-cream-muted">Cargando turnos...</div>
      ) : (
        <ShiftTable shifts={shifts} />
      )}

      <CreateShiftModal
        isOpen={isModalOpen}
        staffOptions={staffOptions}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(shift) => {
          // POST /shifts no devuelve la relación staff — la completamos acá
          // con lo que ya tenemos en staffOptions, así la tabla no necesita
          // un refetch para mostrar el nombre.
          const staff = staffOptions.find((s) => s.id === shift.staffId);
          const withStaff = staff ? { ...shift, staff: { id: staff.id, name: staff.name } } : shift;
          setShifts((prev) =>
            [...prev, withStaff].sort(
              (a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime),
            ),
          );
        }}
      />
    </div>
  );
}
