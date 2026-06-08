'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { Input } from '../../components/ui/input';  
import { Button } from '../../components/ui/button'; 

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
            
            <Input
              label="Nueva Contraseña"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Actualizando...' : 'Restablecer contraseña'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}