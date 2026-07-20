'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { apiFetch } from '../../lib/api';
import { useAuth } from '@/context/AuthContext';

// E6-05 (Epic 6, v1.5): onboarding self-serve — un dueño de gimnasio
// prospecto crea su gimnasio y su propia cuenta ADMIN en un solo paso,
// público, sin pasar por SUPER_ADMIN. POST /auth/signup-gym devuelve un
// access_token (auto-login), mismo patrón que /login.
export default function SignupGymPage() {
  const { login } = useAuth();

  const [gymName, setGymName] = useState('');
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await apiFetch('/auth/signup-gym', {
        method: 'POST',
        body: JSON.stringify({
          gymName,
          address: address || undefined,
          timezone: timezone || undefined,
          ownerName,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.access_token && data.user) {
        document.cookie = `userRole=${data.user.role}; path=/; max-age=86400; SameSite=Strict`;
        document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;
        login(data.user, data.access_token);

        setTimeout(() => {
          window.location.href = '/dashboard/settings';
        }, 100);
      } else {
        setError(data.message || 'No se pudo crear tu gimnasio. Intentá de nuevo.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4 py-8">
      <div className="max-w-md w-full bg-ink-850 p-8 rounded-2xl shadow-sm border border-ink-line">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-cream tracking-tight">SmartBox</h1>
          <p className="text-sm text-cream-muted mt-2">
            Dá de alta tu gimnasio y creá tu cuenta de administrador
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-pop-bg border border-pop/30 text-pop rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <p className="text-xs font-semibold text-cream-faint uppercase">Tu gimnasio</p>
            <Input
              label="Nombre del gimnasio"
              required
              placeholder="PowerFit Norte"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
            />
            <Input
              label="Dirección (opcional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              label="Timezone (opcional, por defecto UTC)"
              placeholder="America/Guayaquil"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-ink-line">
            <p className="text-xs font-semibold text-cream-faint uppercase pt-4">Tu cuenta</p>
            <Input
              label="Tu nombre"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <Input
              label="Correo electrónico"
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
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" isLoading={isLoading}>
            Crear mi gimnasio
          </Button>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs font-medium text-neon-400 hover:underline">
              ¿Ya tenés cuenta? Iniciá sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
