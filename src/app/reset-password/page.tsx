'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token'); 

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!token) {
      setError('Falta el token de recuperación válido.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Reutilizando apiFetch: Pasamos el token limpio como query param
      const res = await apiFetch(`/auth/reset-password?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ password }), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña.');
      }

      setMessage('Contraseña actualizada con éxito. Redirigiendo al login...');
      
      setTimeout(() => {
        router.push('/login'); 
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Encabezado / Logo */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-slate-950 tracking-tight mb-2">
            Nueva Contraseña
          </h2>
          <p className="text-sm text-slate-500">
            Establece tu nueva contraseña de acceso para SmartBox.
          </p>
        </div>
        
        {!token ? (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium text-center">
            Enlace inválido o sin token de acceso. Por favor solicita uno nuevo.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nueva Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-medium">
                {message}
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-sm text-white hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-sm"
            >
              {loading ? 'Actualizando...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}