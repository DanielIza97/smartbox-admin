'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { apiFetch } from '../../lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.access_token && data.user) {
        // 1. Guardar en cookies (de forma síncrona, si es posible)
        document.cookie = `userRole=${data.user.role}; path=/; max-age=86400; SameSite=Strict`;
        document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;

        // 2. Actualizar el contexto
        login(data.user, data.access_token);
        
        // 3. Pequeña pausa de seguridad antes de navegar
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      } else {
        setError(data.message || 'Credenciales inválidas.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">SmartBox</h1>
          <p className="text-sm text-slate-500 mt-2">Ingresa tus credenciales</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Correo Electrónico"
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-1.5">
            <Input
              label="Contraseña"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Entrar
          </Button>

          <div className="text-center pt-2">
            <Link href="/signup-gym" className="text-xs font-medium text-blue-600 hover:underline">
              ¿Sos dueño de un gimnasio? Creá tu cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}