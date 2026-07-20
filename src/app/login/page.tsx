'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { apiFetch } from '../../lib/api';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
        
        // 3. Pequeña pausa de seguridad antes de navegar. CLIENT usa el
        // portal de socios (E6-02), no el panel operativo.
        setTimeout(() => {
          window.location.href = data.user.role === 'CLIENT' ? '/portal' : '/dashboard';
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
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4 relative">
      <div className="absolute top-5 right-5">
        <ThemeToggle className="text-xs font-semibold text-cream-muted hover:text-cream border border-ink-line-strong rounded-full px-3 py-1.5 transition-colors" />
      </div>
      <div className="max-w-md w-full bg-ink-850 p-8 rounded-2xl shadow-sm border border-ink-line">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cream tracking-tight">SmartBox</h1>
          <p className="text-sm text-cream-muted mt-2">Ingresa tus credenciales</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-pop-bg border border-pop/30 text-pop rounded-lg text-sm font-medium">
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
              <Link href="/forgot-password" className="text-xs font-medium text-neon-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Entrar
          </Button>

          <div className="text-center pt-2">
            <Link href="/signup-gym" className="text-xs font-medium text-neon-400 hover:underline">
              ¿Sos dueño de un gimnasio? Creá tu cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}