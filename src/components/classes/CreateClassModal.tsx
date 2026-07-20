'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { ClassOrResource } from '@/types';

interface CreateClassModalProps {
  isOpen: boolean;
  gymId: string;
  onClose: () => void;
  onSuccess: (cls: ClassOrResource) => void;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function CreateClassModal({ isOpen, gymId, onClose, onSuccess }: CreateClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    dayOfWeek: '1',
    startTime: '09:00',
    durationMinutes: '60',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/classes', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          capacity: parseInt(formData.capacity, 10),
          dayOfWeek: parseInt(formData.dayOfWeek, 10),
          startTime: formData.startTime,
          durationMinutes: parseInt(formData.durationMinutes, 10),
          gymId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ name: '', capacity: '', dayOfWeek: '1', startTime: '09:00', durationMinutes: '60' });
        onSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Error al crear la clase.');
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
          <h3 className="text-lg font-bold text-cream">Nueva clase o recurso</h3>
          <button onClick={onClose} className="text-cream-faint hover:text-cream-muted">✕</button>
        </div>

        {error && <div className="p-3 bg-pop-bg text-pop rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            required
            placeholder="Yoga"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-cream-muted mb-1.5">Día de la semana</label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
              className="w-full px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/25 focus:border-neon-400 transition-all text-sm"
            >
              {DAYS.map((day, idx) => (
                <option key={idx} value={idx}>{day}</option>
              ))}
            </select>
          </div>

          <Input
            label="Hora de inicio"
            type="time"
            required
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />

          <Input
            label="Duración (minutos)"
            type="number"
            min="1"
            required
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
          />

          <Input
            label="Cupo máximo"
            type="number"
            min="1"
            required
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />

          <Button type="submit" isLoading={isCreating}>
            {isCreating ? 'Guardando...' : 'Crear clase'}
          </Button>
        </form>
      </div>
    </div>
  );
}
