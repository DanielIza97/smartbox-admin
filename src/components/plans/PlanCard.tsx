'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { Plan } from '@/types';

interface PlanCardProps {
  gymId: string;
  plan: Plan | null;
  // Solo SUPER_ADMIN/ADMIN pueden crear el plan — mismos roles que POST
  // /plans en el backend. STAFF/CLIENT pueden ver el plan pero no crearlo.
  canManage: boolean;
  // Crear un plan llama a Mercado Pago para armar el PreApprovalPlan — sin
  // conexión, el backend rechaza con 400 explícito. Lo bloqueamos antes en
  // vez de dejar que el socio se choque con el error.
  mercadoPagoConnected: boolean;
  onCreated: (plan: Plan) => void;
}

export function PlanCard({
  gymId,
  plan,
  canManage,
  mercadoPagoConnected,
  onCreated,
}: PlanCardProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/plans', {
        method: 'POST',
        body: JSON.stringify({
          name,
          priceCents: Math.round(parseFloat(price) * 100),
          gymId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onCreated(data);
      } else {
        setError(data.message || 'No se pudo crear el plan.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Plan de membresía</h2>

      {plan ? (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Nombre</p>
            <p className="text-sm text-slate-900">{plan.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Precio</p>
            <p className="text-sm text-slate-900">
              ${(plan.priceCents / 100).toFixed(2)} USD / mes
            </p>
          </div>
          <p className="text-xs text-slate-400 italic pt-1">
            Un solo plan por gimnasio en v1.0 — sin edición todavía.
          </p>
        </div>
      ) : canManage ? (
        <>
          <p className="text-sm text-slate-500 mb-4">
            Este gimnasio todavía no tiene un plan de membresía configurado.
          </p>

          {!mercadoPagoConnected ? (
            <p className="text-xs text-slate-400 italic">
              Conectá Mercado Pago antes de crear el plan.
            </p>
          ) : (
            <>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nombre del plan"
                  required
                  placeholder="Plan mensual"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Precio mensual (USD)"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="49.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Button type="submit" isLoading={isCreating}>
                  {isCreating ? 'Creando...' : 'Crear plan'}
                </Button>
              </form>
            </>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500">
          Tu gimnasio todavía no tiene un plan de membresía configurado.
        </p>
      )}
    </div>
  );
}
