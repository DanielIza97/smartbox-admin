'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/src/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Reutilizando tu apiFetch personalizado
      const res = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Ocurrió un error inesperado.');
      }

      setMessage('Si el correo existe, se ha enviado un enlace de recuperación.');
    } catch (err: any) {
      // Maneja tanto errores del backend como caídas del servidor
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
            Recuperar Contraseña
          </h2>
          <p className="text-sm text-slate-500">
            Ingresa el correo electrónico asociado a tu cuenta de SmartBox y te enviaremos un enlace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="example@email.com"
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
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>

          {/* BOTÓN ATRÁS */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 Lightning7.5m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}