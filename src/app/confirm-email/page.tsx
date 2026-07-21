'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  );
  const [message, setMessage] = useState(
    token ? '' : 'Enlace inválido o sin token de confirmación.',
  );

  useEffect(() => {
    if (!token) return;

    const confirm = async () => {
      try {
        const res = await apiFetch('/users/confirm-email-change', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Correo actualizado exitosamente.');
        } else {
          setStatus('error');
          setMessage(data.message || 'No se pudo confirmar el cambio de correo.');
        }
      } catch {
        setStatus('error');
        setMessage('No se pudo conectar con el servidor.');
      }
    };

    confirm();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-md bg-ink-850 p-8 rounded-2xl shadow-sm border border-ink-line text-center space-y-4">
        <h2 className="text-3xl font-bold text-cream tracking-tight">
          Confirmar cambio de correo
        </h2>

        {status === 'loading' && (
          <p className="text-sm text-cream-muted">Verificando tu enlace...</p>
        )}

        {status === 'success' && (
          <div className="p-3 bg-success-bg border border-success/30 text-success rounded-lg text-sm font-medium">
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 bg-pop-bg border border-pop/30 text-pop rounded-lg text-sm font-medium">
            {message}
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cream-muted hover:text-neon-300 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-cream-faint group-hover:text-neon-300 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
