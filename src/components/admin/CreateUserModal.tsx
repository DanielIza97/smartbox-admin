'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { Role } from '@/types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  onSuccess: () => void;
}

export function CreateUserModal({ isOpen, onClose, roles, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const res = await apiFetch('/auth/register-internal', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleName: formData.role,
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5 relative">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-950">Registrar Nuevo Operador</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <Input label="Contraseña" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Rol</label>
            <select className="w-full pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm" 
              onChange={(e) => setFormData({...formData, role: e.target.value})} required>
              <option value="">Selecciona...</option>
              {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>

          <Button type="submit" isLoading={isCreating} className="w-full">
            {isCreating ? 'Guardando...' : 'Confirmar Registro'}
          </Button>
        </form>
      </div>
    </div>
  );
}