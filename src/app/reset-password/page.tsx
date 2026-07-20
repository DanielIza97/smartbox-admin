'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!token) {
      setError('Falta el token de recuperación válido.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña.');
      }

      setMessage('Contraseña actualizada con éxito. Redirigiendo al login...');

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se pudo conectar con el servidor.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-md bg-ink-850 p-8 rounded-2xl shadow-sm border border-ink-line">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-cream tracking-tight mb-2">
            Nueva Contraseña
          </h2>
          <p className="text-sm text-cream-muted">
            Establece tu nueva contraseña de acceso para SmartBox.
          </p>
        </div>

        {!token ? (
          <div className="space-y-4">
            <div className="p-3 bg-pop-bg border border-pop/30 text-pop rounded-lg text-sm font-medium text-center">
              Enlace inválido o sin token de acceso. Por favor solicita uno nuevo.
            </div>
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-neon-400 hover:underline"
              >
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nueva Contraseña"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {message && (
              <div className="p-3 bg-success-bg border border-success/30 text-success rounded-lg text-sm font-medium">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 bg-pop-bg border border-pop/30 text-pop rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={loading}>
              {loading ? 'Actualizando...' : 'Restablecer contraseña'}
            </Button>

            <div className="text-center pt-2">
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
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
