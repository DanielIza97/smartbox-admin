'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoutButton } from '@/components/ui/LogoutButton'; 
import { apiFetch } from '@/lib/api'; // Importación de tu API
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
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
      // 1. Recuperamos el token del almacenamiento local
      const token = localStorage.getItem('token');
      const bodyData = JSON.stringify({ newEmail: newEmail });
      console.log("Enviando al backend:", bodyData); 
      const response = await apiFetch('/users/request-email-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ newEmail }),
      });
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        const errorMessage = errorData.message || 'No se pudo enviar la solicitud.';
        
        throw new Error(errorMessage);
      }
      
      setMessage({ type: 'success', text: '¡Solicitud enviada! Revisa tu correo actual.' });
      setNewEmail('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Ocurrió un error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Encabezado */}
        <div className="bg-indigo-600 p-10 rounded-3xl shadow-xl shadow-indigo-200">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors mb-6 bg-white/10 px-4 py-2 rounded-full w-fit"
          >
            <span>←</span> Volver atrás
          </button>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-1">Tu cuenta personal</p>
              <h1 className="text-6xl font-extrabold text-white tracking-tighter">Mi Perfil</h1>
            </div>
            <LogoutButton 
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all" 
            />
          </div>
        </div>

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
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-bold text-slate-900">Identidad</h2>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {user?.role || 'USUARIO'}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Correo actual</p>
                <p className="text-slate-800 font-medium">{user?.email || 'No disponible'}</p>
              </div>

              <Input label="Nombre" value={isEditing ? name : (user?.name || '---')} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
              <Button variant="secondary" isLoading={savingName} onClick={handleSaveName}>
                {isEditing ? 'Guardar Cambios' : 'Editar Nombre'}
              </Button>
            </div>
          </div>

          {/* Seguridad (Petición de Cambio) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Seguridad</h2>
            <div className="space-y-4">
              <Input label="Nuevo correo" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="nuevo@ejemplo.com" />
              <Button isLoading={loading} onClick={handleRequestChange}>Solicitar cambio</Button>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Actividad Reciente</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4 border-r border-slate-100">
              <div className="bg-indigo-50 p-4 rounded-2xl text-2xl">🕒</div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Último inicio de sesión</p>
                <p className="text-slate-900 font-semibold text-lg">Hoy, 14:20</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-4 rounded-2xl text-2xl">💻</div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Dispositivo</p>
                <p className="text-slate-900 font-semibold text-lg">Chrome / macOS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}