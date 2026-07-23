'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MercadoPagoConnectionCardProps {
  gymId: string;
  connected: boolean;
  // Solo SUPER_ADMIN/ADMIN pueden conectar — mismos roles que
  // PUT /gyms/:id/mercadopago/credentials en el backend. STAFF puede ver el
  // estado pero no conectar.
  canConnect: boolean;
}

const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/memberships/webhook/mercadopago`;

// Ya no es un botón que redirige a un checkout OAuth de Mercado Pago — ese
// flujo dependía de una Aplicación de SmartBox, que Mercado Pago no permite
// crear sin una empresa registrada en Argentina (no viable para Ecuador).
// Ahora el gimnasio pega su propio access token (generado desde su propia
// cuenta, sin Aplicación de por medio) y el secreto de su propio webhook.
export function MercadoPagoConnectionCard({
  gymId,
  connected,
  canConnect,
}: MercadoPagoConnectionCardProps) {
  const [accessToken, setAccessToken] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConnecting(true);
    setError('');

    try {
      const res = await apiFetch(`/gyms/${gymId}/mercadopago/credentials`, {
        method: 'PUT',
        body: JSON.stringify({ accessToken, webhookSecret }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setAccessToken('');
        setWebhookSecret('');
      } else {
        setError(data.message || 'No se pudo conectar la cuenta de Mercado Pago.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setIsConnecting(false);
    }
  };

  const isConnected = connected || success;

  return (
    <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-cream">Mercado Pago</h2>
        {isConnected ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success-bg border border-success/30 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-success rounded-full" /> Conectado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warn bg-warn-bg border border-warn/30 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-warn rounded-full" /> Sin conectar
          </span>
        )}
      </div>

      <p className="text-sm text-cream-muted mb-4">
        {isConnected
          ? 'Este gimnasio ya conectó su propia cuenta de Mercado Pago — los cobros de las membresías van directo ahí, SmartBox nunca los toca.'
          : 'Sin conectar, este gimnasio no puede crear un plan de membresía ni recibir cobros. La plata siempre va a la cuenta del gimnasio, nunca a la de SmartBox (modelo Marketplace).'}
      </p>

      {!isConnected && canConnect && (
        <>
          <ol className="text-xs text-cream-faint mb-4 space-y-2 list-decimal list-inside">
            <li>
              Entrá a tu cuenta de Mercado Pago → Tu negocio → Configuración → Credenciales, y copiá tu Access Token de producción.
            </li>
            <li>
              En tu cuenta de Mercado Pago, configurá un webhook en Notificaciones apuntando a{' '}
              <code className="bg-ink-950 px-1.5 py-0.5 rounded text-cream-muted break-all">{webhookUrl}</code>{' '}
              para los eventos <code className="bg-ink-950 px-1 py-0.5 rounded">subscription_preapproval</code> y{' '}
              <code className="bg-ink-950 px-1 py-0.5 rounded">subscription_authorized_payment</code>, y copiá el secreto de firma que te muestra ahí.
            </li>
          </ol>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Access Token"
              type="password"
              required
              placeholder="APP_USR-..."
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
            <Input
              label="Secreto del webhook"
              type="password"
              required
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
            />

            {error && (
              <div className="p-3 bg-pop-bg text-pop rounded-lg text-sm">{error}</div>
            )}

            <Button type="submit" isLoading={isConnecting}>
              Conectar Mercado Pago
            </Button>
          </form>
        </>
      )}

      {!isConnected && !canConnect && (
        <p className="text-xs text-cream-faint italic">
          Solo un ADMIN o SUPER_ADMIN puede conectar Mercado Pago.
        </p>
      )}
    </div>
  );
}
