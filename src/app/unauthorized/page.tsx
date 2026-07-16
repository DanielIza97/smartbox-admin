'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
          Acceso restringido
        </h1>
        <p className="text-sm text-slate-500">
          {user?.role
            ? `Tu rol (${user.role}) no tiene permiso para ver esta sección.`
            : 'No tenés permiso para ver esta sección.'}
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center w-full py-3 px-4 font-medium rounded-xl transition-all text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
