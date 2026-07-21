'use client';

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Role, Gym } from '@/types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  onSuccess: () => void;
}

export function CreateUserModal({ isOpen, onClose, roles, onSuccess }: CreateUserModalProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', gymId: '' });
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loadingGyms, setLoadingGyms] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const selectedRoleName = roles.find((r) => r.id === formData.role)?.name;
  // SUPER_ADMIN no tiene gymId propio para que el backend lo autocomplete
  // (a diferencia de ADMIN) — este modal necesita pedirlo a mano cuando el
  // rol a crear no es SUPER_ADMIN.
  const needsGymPicker = isSuperAdmin && !!selectedRoleName && selectedRoleName !== 'SUPER_ADMIN';

  useEffect(() => {
    if (!isOpen || !isSuperAdmin) return;

    const loadGyms = async () => {
      try {
        setLoadingGyms(true);
        const res = await apiFetch('/gyms');
        const data = res.ok ? await res.json() : [];
        setGyms(Array.isArray(data) ? data : []);
      } catch {
        setGyms([]);
      } finally {
        setLoadingGyms(false);
      }
    };

    loadGyms();
  }, [isOpen, isSuperAdmin]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleId: formData.role,
          gymId: needsGymPicker ? formData.gymId : undefined,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || 'Error al crear usuario');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-ink-850 w-full max-w-md rounded-2xl p-6 shadow-xl border border-ink-line space-y-5 relative">
        <div className="flex justify-between items-center border-b border-ink-line pb-3">
          <h3 className="text-lg font-bold text-cream">Registrar Nuevo Operador</h3>
          <button onClick={onClose} className="text-cream-faint hover:text-cream-muted">✕</button>
        </div>

        {error && <div className="p-3 bg-pop-bg text-pop rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <Input label="Contraseña" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-cream-muted">Rol</label>
            <select className="w-full pl-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value, gymId: ''})} required>
              <option value="">Selecciona...</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {needsGymPicker && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-cream-muted">Gimnasio</label>
              <select
                className="w-full pl-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm disabled:opacity-60"
                value={formData.gymId}
                onChange={(e) => setFormData({...formData, gymId: e.target.value})}
                disabled={loadingGyms || gyms.length === 0}
                required
              >
                {loadingGyms && <option value="">Cargando gimnasios...</option>}
                {!loadingGyms && gyms.length === 0 && <option value="">Sin gimnasios disponibles</option>}
                {!loadingGyms && gyms.length > 0 && <option value="">Selecciona...</option>}
                {gyms.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          )}

          <Button type="submit" isLoading={isCreating} className="w-full">
            {isCreating ? 'Guardando...' : 'Confirmar Registro'}
          </Button>
        </form>
      </div>
    </div>
  );
}
