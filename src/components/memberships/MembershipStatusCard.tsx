'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ConfirmationModal } from '../ui/ConfirmationModel';
import { Membership, Plan } from '@/types';

interface MembershipStatusCardProps {
  membership: Membership | null;
  // E6-04: un gimnasio puede tener varios planes — el socio elige a cuál
  // suscribirse antes de ir al checkout de Mercado Pago.
  plans: Plan[];
  onChange: (membership: Membership) => void;
}

const STATUS_LABEL: Record<Membership['status'], string> = {
  active: 'Activa',
  past_due: 'Pago pendiente',
  cancelled: 'Cancelada',
};

const STATUS_STYLE: Record<Membership['status'], string> = {
  active: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  past_due: 'text-amber-700 bg-amber-50 border-amber-100',
  cancelled: 'text-slate-500 bg-slate-100 border-slate-200',
};

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function MembershipStatusCard({ membership, plans, onChange }: MembershipStatusCardProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? '');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState('');

  // plans llega async del padre — si todavía no había nada seleccionado
  // cuando terminó de cargar, preseleccionamos el primero.
  useEffect(() => {
    if (!selectedPlanId && plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans]);

  const handleSubscribe = async () => {
    if (!selectedPlanId) return;
    setIsSubscribing(true);
    setError('');
    try {
      const res = await apiFetch('/memberships/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId: selectedPlanId }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        // Checkout hosted de Mercado Pago para cargar la tarjeta — cero UI
        // de pago propia, ver CLAUDE.md del backend.
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || 'No se pudo iniciar la suscripción.');
        setIsSubscribing(false);
      }
    } catch {
      setError('Error de conexión.');
      setIsSubscribing(false);
    }
  };

  const handleCancel = async () => {
    if (!membership) return;
    setConfirmOpen(false);
    setIsCancelling(true);
    setError('');
    try {
      const res = await apiFetch(`/memberships/${membership.id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        onChange(data);
      } else {
        setError(data.message || 'No se pudo cancelar la membresía.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setIsCancelling(false);
    }
  };

  const canSubscribe = !membership || membership.status === 'cancelled';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-slate-900">Mi membresía</h2>
        {membership && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1 rounded-full ${STATUS_STYLE[membership.status]}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {STATUS_LABEL[membership.status]}
          </span>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm my-4">{error}</div>}

      {!membership ? (
        <p className="text-sm text-slate-500 mb-4">Todavía no tenés una membresía.</p>
      ) : (
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Plan</p>
            <p className="text-slate-900">
              {membership.plan?.name || '—'}
              {membership.plan && ` — $${(membership.plan.priceCents / 100).toFixed(2)} USD/mes`}
            </p>
          </div>
          {membership.trialEndsAt && new Date(membership.trialEndsAt) > new Date() && (
            <p className="text-slate-500">
              En período de prueba hasta {formatDate(membership.trialEndsAt)}.
            </p>
          )}
          {membership.status !== 'cancelled' && (
            <p className="text-slate-500">
              {membership.cancelAtPeriodEnd
                ? `Se cancelará el ${formatDate(membership.currentPeriodEnd)} y no se renovará.`
                : `Tu período actual vence el ${formatDate(membership.currentPeriodEnd)}.`}
            </p>
          )}
          {membership.status === 'past_due' && (
            <p className="text-amber-700">
              Tu último cobro fue rechazado. Actualizá tu tarjeta desde tu propia cuenta de
              Mercado Pago (Débitos automáticos) — no perdés el acceso todavía.
            </p>
          )}
        </div>
      )}

      {canSubscribe && (
        <div className="mt-4">
          {plans.length === 0 ? (
            <p className="text-sm text-slate-500">
              Tu gimnasio todavía no tiene planes de membresía configurados.
            </p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedPlanId === plan.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="planId"
                        value={plan.id}
                        checked={selectedPlanId === plan.id}
                        onChange={() => setSelectedPlanId(plan.id)}
                        className="accent-indigo-600"
                      />
                      <span className="text-sm font-medium text-slate-900">{plan.name}</span>
                    </span>
                    <span className="text-sm text-slate-500">
                      ${(plan.priceCents / 100).toFixed(2)} USD/mes
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing || !selectedPlanId}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                {isSubscribing ? 'Redirigiendo...' : 'Suscribirme'}
              </button>
            </>
          )}
        </div>
      )}

      {membership && membership.status === 'active' && !membership.cancelAtPeriodEnd && (
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={isCancelling}
          className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-70 transition-colors"
        >
          {isCancelling ? 'Cancelando...' : 'Cancelar membresía'}
        </button>
      )}

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Cancelar membresía"
        message="Vas a conservar el acceso hasta el fin del período ya pagado, pero no se va a renovar. ¿Confirmás?"
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
