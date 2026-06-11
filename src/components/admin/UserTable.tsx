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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <p className="text-sm text-slate-500">{message}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export function UserTable({ users, onDelete }: { users: User[], onDelete: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setLoadingId(userToDelete.id);
    try {
      await apiFetch(`/users/${userToDelete.id}`, { method: 'DELETE' });
      onDelete(); 
    } catch (error) {
      alert('Error al eliminar usuario');
    } finally {
      setLoadingId(null);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">Listado de Usuarios</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length > 0 ? (
                users.map((user: User) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 capitalize">
                      {typeof user.role === 'object' && user.role !== null ? user.role.name : user.role}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setUserToDelete(user)}
                        disabled={loadingId === user.id}
                        className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
                      >
                        {loadingId === user.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No hay usuarios registrados.</td>
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