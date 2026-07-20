'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Sin backdrop-blur: se ve casi igual de "vidrio" con solo transparencia +
// borde + sombra, y es mucho más barato de componer en cada mousemove
// (TiltCard transforma estas mismas tarjetas todo el tiempo).
const GLASS_CARD =
  'bg-ink-850/90 rounded-3xl border border-ink-line-strong shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-black/50 transition-shadow';

export function ProfileContent() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSaveName = async () => {
    if (!isEditing) {
      setName(user?.name || '');
      setIsEditing(true);
      return;
    }

    setSavingName(true);
    setMessage(null);

    try {
      const response = await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || 'No se pudo actualizar el nombre.');
      }

      updateUser({ name });
      setMessage({ type: 'success', text: 'Nombre actualizado con éxito.' });
      setIsEditing(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSavingName(false);
    }
  };

  const handleRequestChange = async () => {
    if (!newEmail) return;
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('/users/request-email-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        const errorMessage = errorData.message || 'No se pudo enviar la solicitud.';

        throw new Error(errorMessage);
      }

      setMessage({ type: 'success', text: '¡Solicitud enviada! Revisa tu correo actual.' });
      setNewEmail('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-wood-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-wood-500/15 blur-2xl" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-10">

        {/* Encabezado */}
        <TiltCard
          maxTilt={5}
          className="relative overflow-hidden bg-gradient-to-br from-ink-800 via-ink-800 to-ink-900 p-10 rounded-[2rem] shadow-2xl shadow-black/50 border border-ink-line-strong"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
          <div className="relative">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-cream-muted hover:text-cream transition-colors mb-6 bg-ink-800/50 px-4 py-2 rounded-full w-fit"
            >
              <span>←</span> Volver atrás
            </button>

            <div className="flex justify-between items-end gap-4 flex-wrap">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink-800/60 border border-wood-600/40 shadow-lg text-2xl font-extrabold text-cream">
                  {initial}
                </div>
                <div>
                  <p className="text-wood-400 font-bold text-xs uppercase tracking-widest mb-1">Tu cuenta personal</p>
                  <h1 className="text-5xl md:text-6xl font-extrabold text-cream tracking-tighter">Mi Perfil</h1>
                </div>
              </div>
              <LogoutButton
                className="bg-ink-800/50 hover:bg-ink-700/70 text-cream px-5 py-3 rounded-xl text-sm font-bold transition-all border border-ink-line"
              />
            </div>
          </div>
        </TiltCard>

        {/* Notificaciones */}
        {message && (
          <div className={`p-4 rounded-2xl text-sm font-medium border ${
            message.type === 'success' ? 'bg-success-bg border-success/30 text-success' : 'bg-pop-bg border-pop/30 text-pop'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Identidad */}
          <TiltCard className={`${GLASS_CARD} p-8`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-bold text-cream">Identidad</h2>
              <span className="px-3 py-1 bg-ink-800 text-neon-300 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {user?.role || 'USUARIO'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-ink-850/70 rounded-xl border border-ink-line-strong shadow-inner">
                <p className="text-[10px] text-cream-faint font-bold uppercase tracking-widest mb-1">Correo actual</p>
                <p className="text-cream font-medium">{user?.email || 'No disponible'}</p>
              </div>

              <Input label="Nombre" value={isEditing ? name : (user?.name || '---')} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
              <Button variant="secondary" isLoading={savingName} onClick={handleSaveName}>
                {isEditing ? 'Guardar Cambios' : 'Editar Nombre'}
              </Button>
            </div>
          </TiltCard>

          {/* Seguridad (Petición de Cambio) */}
          <TiltCard className={`${GLASS_CARD} p-8`}>
            <h2 className="text-lg font-bold text-cream mb-6">Seguridad</h2>
            <div className="space-y-4">
              <Input label="Nuevo correo" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="nuevo@ejemplo.com" />
              <Button isLoading={loading} onClick={handleRequestChange}>Solicitar cambio</Button>
            </div>
          </TiltCard>
        </div>

        {/* Actividad Reciente */}
        <TiltCard maxTilt={3} className={`${GLASS_CARD} p-8`}>
          <h3 className="font-bold text-lg text-cream mb-6">Actividad Reciente</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4 md:border-r border-ink-line-strong">
              <div className="bg-gradient-to-br from-ink-900 to-white p-4 rounded-2xl text-2xl shadow-inner border border-ink-line-strong">🕒</div>
              <div>
                <p className="text-xs text-cream-faint uppercase font-bold">Último inicio de sesión</p>
                <p className="text-cream font-semibold text-lg">Hoy, 14:20</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-ink-900 to-white p-4 rounded-2xl text-2xl shadow-inner border border-ink-line-strong">💻</div>
              <div>
                <p className="text-xs text-cream-faint uppercase font-bold">Dispositivo</p>
                <p className="text-cream font-semibold text-lg">Chrome / macOS</p>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
