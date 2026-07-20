'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-md bg-ink-850 p-8 rounded-2xl shadow-sm border border-ink-line text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h1 className="text-2xl font-bold text-cream tracking-tight">
          Acceso restringido
        </h1>
        <p className="text-sm text-cream-muted">
          {user?.role
            ? `Tu rol (${user.role}) no tiene permiso para ver esta sección.`
            : 'No tenés permiso para ver esta sección.'}
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center w-full py-3 px-4 font-medium rounded-xl transition-all text-sm bg-wood-600 hover:bg-wood-500 text-cream"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
