'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { Plan } from '@/types';

interface CreatePlanModalProps {
  isOpen: boolean;
  gymId: string;
  onClose: () => void;
  onSuccess: (plan: Plan) => void;
}

export function CreatePlanModal({ isOpen, gymId, onClose, onSuccess }: CreatePlanModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/plans', {
        method: 'POST',
        body: JSON.stringify({
          name,
          priceCents: Math.round(parseFloat(price) * 100),
          gymId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setName('');
        setPrice('');
        onSuccess(data);
        onClose();
      } else {
        setError(data.message || 'No se pudo crear el plan.');
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
          <h3 className="text-lg font-bold text-cream">Nuevo plan de membresía</h3>
          <button onClick={onClose} className="text-cream-faint hover:text-cream-muted">✕</button>
        </div>

        {error && <div className="p-3 bg-pop-bg text-pop rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del plan"
            required
            placeholder="Plan premium"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Precio mensual (USD)"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="49.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button type="submit" isLoading={isCreating}>
            {isCreating ? 'Creando...' : 'Crear plan'}
          </Button>
        </form>
      </div>
    </div>
  );
}
