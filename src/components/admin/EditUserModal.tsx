'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiFetch } from '@/lib/api';
import { User, Role } from '@/types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  roles: Role[];
  onSuccess: () => void;
}

export function EditUserModal({ isOpen, onClose, user, roles, onSuccess }: EditUserModalProps) {
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    role: typeof user?.role === 'object' ? user.role.name : (user?.role || '') 
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      await apiFetch(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error al actualizar usuario');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5">
        {/* Cambiado a text-slate-950 para asegurar visibilidad en negro */}
        <h3 className="text-lg font-bold text-slate-950">Editar Usuario: {user?.name}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <div className="flex flex-col gap-1.5">
            {/* Cambiado a text-slate-950 */}
            <label className="text-sm font-medium text-slate-950">Rol</label>
            <select 
              className="w-full pl-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" isLoading={isSaving} className="flex-1">Guardar Cambios</Button>
          </div>
        </form>
      </div>
    </div>
  );
}