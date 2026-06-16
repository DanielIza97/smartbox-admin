'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button'; 

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
          <Input
            label="Correo Electrónico"
            type="email"
            required
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

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

          <Button type="submit" isLoading={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </Button>

          {/* BOTÓN ATRÁS */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors"
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
      </div>
    </div>
  );
}