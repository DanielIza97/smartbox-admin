'use client';

import { useCallback, useEffect, useState } from 'react';
import { PlanTable } from './PlanTable';
import { CreatePlanModal } from './CreatePlanModal';
import { apiFetch } from '@/lib/api';
import { Plan } from '@/types';

interface PlansSectionProps {
  gymId: string;
  // Solo SUPER_ADMIN/ADMIN pueden crear planes — mismos roles que POST
  // /plans en el backend.
  canManage: boolean;
  // Crear un plan llama a Mercado Pago para armar el PreApprovalPlan — sin
  // conexión, el backend rechaza con 400 explícito. Lo bloqueamos antes en
  // vez de dejar que el gym se choque con el error.
  mercadoPagoConnected: boolean;
}

export function PlansSection({ gymId, canManage, mercadoPagoConnected }: PlansSectionProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // GET /plans le devuelve TODOS los planes a un SUPER_ADMIN (sin scope de
  // gym) — filtramos acá, mismo truco que ClassesSection/ShiftsSection.
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/plans');
      const data: Plan[] = res.ok ? await res.json() : [];
      setPlans(data.filter((p) => p.gymId === gymId));
    } catch (error) {
      console.error('Error al cargar los planes:', error);
    } finally {
      setLoading(false);
    }
  }, [gymId]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          {mercadoPagoConnected ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm"
            >
              + Nuevo plan
            </button>
          ) : (
            <p className="text-xs text-cream-faint italic">
              Conecta Mercado Pago antes de crear planes.
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-cream-muted">Cargando planes...</div>
      ) : (
        <PlanTable plans={plans} />
      )}

      <CreatePlanModal
        isOpen={isModalOpen}
        gymId={gymId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(plan) => setPlans((prev) => [...prev, plan])}
      />
    </div>
  );
}
