'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { Location } from '@/types';

interface CreateLocationModalProps {
  isOpen: boolean;
  gymId: string;
  onClose: () => void;
  onSuccess: (location: Location) => void;
}

export function CreateLocationModal({ isOpen, gymId, onClose, onSuccess }: CreateLocationModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/locations', {
        method: 'POST',
        body: JSON.stringify({ name, address: address || undefined, gymId }),
      });

      const data = await res.json();
      if (res.ok) {
        setName('');
        setAddress('');
        onSuccess(data);
        onClose();
      } else {
        setError(data.message || 'No se pudo crear la sucursal.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-ink-850 w-full max-w-md rounded-2xl p-6 shadow-xl border border-ink-line space-y-5 relative">
        <div className="flex justify-between items-center border-b border-ink-line pb-3">
          <h3 className="text-lg font-bold text-cream">Nueva sucursal</h3>
          <button onClick={onClose} className="text-cream-faint hover:text-cream-muted">✕</button>
        </div>

        {error && <div className="p-3 bg-pop-bg text-pop rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            required
            placeholder="Sucursal Norte"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Dirección (opcional)"
            placeholder="Av. Norte 123"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button type="submit" isLoading={isCreating}>
            {isCreating ? 'Creando...' : 'Crear sucursal'}
          </Button>
        </form>
      </div>
    </div>
  );
}
