'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface MercadoPagoConnectionCardProps {
  gymId: string;
  connected: boolean;
  // Solo SUPER_ADMIN/ADMIN pueden iniciar la conexión — mismos roles que
  // GET /gyms/:id/mercadopago/connect en el backend. STAFF puede ver el
  // estado pero no conectar.
  canConnect: boolean;
}

export function MercadoPagoConnectionCard({
  gymId,
  connected,
  canConnect,
}: MercadoPagoConnectionCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const res = await apiFetch(`/gyms/${gymId}/mercadopago/connect`);
      const data = await res.json();

      if (res.ok && data.authorizationUrl) {
        // Modelo Marketplace: redirige al checkout hosted de Mercado Pago
        // para que el dueño del gym autorice la conexión — nada de UI de
        // pago propia acá, ver CLAUDE.md del backend.
        window.location.href = data.authorizationUrl;
      } else {
        setError(data.message || 'No se pudo iniciar la conexión con Mercado Pago.');
        setIsConnecting(false);
      }
    } catch {
      setError('Error de conexión.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-cream">Mercado Pago</h2>
        {connected ? (
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
        {connected
          ? 'Este gimnasio ya conectó su propia cuenta de Mercado Pago — los cobros de las membresías van directo ahí, SmartBox nunca los toca.'
          : 'Sin conectar, este gimnasio no puede crear un plan de membresía ni recibir cobros. La plata siempre va a la cuenta del gimnasio, nunca a la de SmartBox (modelo Marketplace).'}
      </p>

      {error && <div className="p-3 bg-pop-bg text-pop rounded-lg text-sm mb-4">{error}</div>}

      {!connected && canConnect && (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-wood-600 hover:bg-wood-500 disabled:opacity-70 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          {isConnecting ? 'Redirigiendo...' : 'Conectar con Mercado Pago'}
        </button>
      )}

      {!connected && !canConnect && (
        <p className="text-xs text-cream-faint italic">
          Solo un ADMIN o SUPER_ADMIN puede iniciar esta conexión.
        </p>
      )}
    </div>
  );
}
