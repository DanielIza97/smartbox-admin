'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { apiFetch } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        router.push('/dashboard');
      } else {
        setError(
          data.message ||
          'Credenciales inválidas. Inténtalo de nuevo.'
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        'No se pudo conectar con el servidor. Verifica que tu backend esté encendido.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Encabezado / Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">
            SmartBox
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        {/* Mensaje de Error Visual */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={login} className="space-y-5">
          <Input
            label="Correo Electrónico"
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contraseña"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" isLoading={isLoading}>
            Entrar
          </Button>
        </form>

      </div>
    </div>
  );
}