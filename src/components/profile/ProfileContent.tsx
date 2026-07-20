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
  'bg-white/85 rounded-3xl border border-white/70 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-slate-300/60 transition-shadow';

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 blur-2xl" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-10">

        {/* Encabezado */}
        <TiltCard
          maxTilt={5}
          className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 p-10 rounded-[2rem] shadow-2xl shadow-indigo-500/30 border border-white/20"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
          <div className="relative">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors mb-6 bg-white/15 px-4 py-2 rounded-full w-fit"
            >
              <span>←</span> Volver atrás
            </button>

            <div className="flex justify-between items-end gap-4 flex-wrap">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/30 shadow-lg text-2xl font-extrabold text-white">
                  {initial}
                </div>
                <div>
                  <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-1">Tu cuenta personal</p>
                  <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter">Mi Perfil</h1>
                </div>
              </div>
              <LogoutButton
                className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all border border-white/10"
              />
            </div>
          </div>
        </TiltCard>

        {/* Notificaciones */}
        {message && (
          <div className={`p-4 rounded-2xl text-sm font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Identidad */}
          <TiltCard className={`${GLASS_CARD} p-8`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-bold text-slate-900">Identidad</h2>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {user?.role || 'USUARIO'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl border border-white/80 shadow-inner">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Correo actual</p>
                <p className="text-slate-800 font-medium">{user?.email || 'No disponible'}</p>
              </div>

              <Input label="Nombre" value={isEditing ? name : (user?.name || '---')} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
              <Button variant="secondary" isLoading={savingName} onClick={handleSaveName}>
                {isEditing ? 'Guardar Cambios' : 'Editar Nombre'}
              </Button>
            </div>
          </TiltCard>

          {/* Seguridad (Petición de Cambio) */}
          <TiltCard className={`${GLASS_CARD} p-8`}>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Seguridad</h2>
            <div className="space-y-4">
              <Input label="Nuevo correo" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="nuevo@ejemplo.com" />
              <Button isLoading={loading} onClick={handleRequestChange}>Solicitar cambio</Button>
            </div>
          </TiltCard>
        </div>

        {/* Actividad Reciente */}
        <TiltCard maxTilt={3} className={`${GLASS_CARD} p-8`}>
          <h3 className="font-bold text-lg text-slate-900 mb-6">Actividad Reciente</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4 md:border-r border-slate-200/70">
              <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-2xl text-2xl shadow-inner border border-white/80">🕒</div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Último inicio de sesión</p>
                <p className="text-slate-900 font-semibold text-lg">Hoy, 14:20</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-2xl text-2xl shadow-inner border border-white/80">💻</div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Dispositivo</p>
                <p className="text-slate-900 font-semibold text-lg">Chrome / macOS</p>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
