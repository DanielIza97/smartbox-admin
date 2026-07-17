'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';

interface CreateGymModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateGymModal({ isOpen, onClose, onSuccess }: CreateGymModalProps) {
  const [formData, setFormData] = useState({ name: '', address: '', timezone: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/gyms', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          address: formData.address || undefined,
          timezone: formData.timezone || undefined,
        }),
      });

      if (res.ok) {
        setFormData({ name: '', address: '', timezone: '' });
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || 'Error al crear el gimnasio');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5 relative">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-950">Dar de alta un gimnasio</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Dirección (opcional)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input
            label="Timezone (opcional, por defecto UTC)"
            placeholder="America/Guayaquil"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
          />

          <Button type="submit" isLoading={isCreating} className="w-full">
            {isCreating ? 'Guardando...' : 'Crear gimnasio'}
          </Button>
        </form>
      </div>
    </div>
  );
}
