'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { User } from '@/types'; 

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-ink-850 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 border border-ink-line">
        <h3 className="text-lg font-bold text-cream">{title}</h3>
        <p className="text-sm text-cream-muted">{message}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm font-semibold text-cream-muted bg-ink-800 rounded-xl hover:bg-ink-700 transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm font-semibold text-cream bg-pop rounded-xl hover:opacity-90 transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

interface UserTableProps {
  users: User[];
  onDelete: () => void;
  onEdit: (user: User) => void;
}

export function UserTable({ users, onDelete, onEdit }: UserTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setLoadingId(userToDelete.id);
    try {
      await apiFetch(`/users/${userToDelete.id}`, { method: 'DELETE' });
      onDelete(); 
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar usuario');
    } finally {
      setLoadingId(null);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-ink-line-strong shadow-sm bg-ink-850">
        <div className="px-6 py-4 border-b border-ink-line bg-ink-900/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-cream">Listado de Usuarios</h2>
          <span className="text-xs font-semibold text-cream-muted uppercase">{users.length} Registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-cream-muted">
            <thead className="text-xs uppercase bg-ink-950 text-cream-muted font-semibold border-b border-ink-line-strong">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-line">
              {users.length > 0 ? (
                users.map((user: User) => (
                  <tr key={user.id} className="hover:bg-ink-950 transition-colors group">
                    <td className="px-6 py-4 font-medium text-cream whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 capitalize">
                      {typeof user.role === 'object' && user.role !== null ? user.role.name : user.role}
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button 
                        onClick={() => onEdit(user)}
                        className="text-neon-400 hover:text-neon-300 font-semibold transition-colors"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => setUserToDelete(user)}
                        disabled={loadingId === user.id}
                        className="text-pop hover:text-pop font-semibold transition-colors disabled:opacity-50"
                      >
                        {loadingId === user.id ? '...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-cream-faint">
                    No hay usuarios registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={!!userToDelete}
        title="¿Eliminar usuario?"
        message={`¿Estás seguro de eliminar a ${userToDelete?.name}? Esta acción no se puede deshacer.`}
        onCancel={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}