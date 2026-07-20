'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { Input } from '../../components/ui/input';   
import { Button } from '../../components/ui/button';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('¡Usuario registrado con éxito! Redirigiendo al login...');
        setName('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          router.push('/login');
        }, 2500);
      } else {
        setError(data.message || 'No se pudo completar el registro. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error(error);
      setError('No se pudo conectar con el servidor. Verifica que tu backend esté encendido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4 py-8">
      <div className="max-w-md w-full bg-ink-850 p-8 rounded-2xl shadow-sm border border-ink-line">
        
        {/* Encabezado / Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-cream tracking-tight">
            SmartBox
          </h1>
          <p className="text-sm text-cream-muted mt-2">
            Crea una nueva cuenta en la plataforma
          </p>
        </div>

        {/* Alertas Visuales */}
        {error && (
          <div className="mb-5 p-3 bg-pop-bg border border-pop/30 text-pop rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 bg-success-bg border border-success/30 text-success rounded-lg text-sm font-medium">
            {successMessage}
          </div>
        )}

        {/* Formulario Reutilizando tus componentes */}
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Nombre Completo"
            type="text"
            required
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Tu Button con control de carga e hijos dinámicos */}
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Registrando cuenta...' : 'Registrarse'}
          </Button>

          {/* Enlace para volver al Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-cream-muted">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href="/login"
                className="font-semibold text-neon-400 hover:text-neon-300 hover:underline transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}