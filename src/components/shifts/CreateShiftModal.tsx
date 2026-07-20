'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { Shift, User } from '@/types';

interface CreateShiftModalProps {
  isOpen: boolean;
  staffOptions: User[];
  onClose: () => void;
  onSuccess: (shift: Shift) => void;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function CreateShiftModal({ isOpen, staffOptions, onClose, onSuccess }: CreateShiftModalProps) {
  const [formData, setFormData] = useState({
    staffId: '',
    dayOfWeek: '1',
    startTime: '09:00',
    endTime: '17:00',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/shifts', {
        method: 'POST',
        body: JSON.stringify({
          staffId: formData.staffId,
          dayOfWeek: parseInt(formData.dayOfWeek, 10),
          startTime: formData.startTime,
          endTime: formData.endTime,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ staffId: '', dayOfWeek: '1', startTime: '09:00', endTime: '17:00' });
        onSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Error al crear el turno.');
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
          <h3 className="text-lg font-bold text-cream">Nuevo turno de trabajo</h3>
          <button onClick={onClose} className="text-cream-faint hover:text-cream-muted">✕</button>
        </div>

        {error && <div className="p-3 bg-pop-bg text-pop rounded-lg text-sm">{error}</div>}

        {staffOptions.length === 0 ? (
          <p className="text-sm text-cream-muted">
            Tu gimnasio todavía no tiene usuarios con rol STAFF. Creá uno desde Usuarios y Roles primero.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream-muted mb-1.5">Staff</label>
              <select
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/25 focus:border-neon-400 transition-all text-sm"
              >
                <option value="">Seleccioná...</option>
                {staffOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

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
              label="Desde"
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />

            <Input
              label="Hasta"
              type="time"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />

            <Button type="submit" isLoading={isCreating}>
              {isCreating ? 'Guardando...' : 'Crear turno'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
