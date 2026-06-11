'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { User } from '@/types'; 

export function UserTable({ users, onDelete }: { users: User[], onDelete: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    setLoadingId(id);
    try {
      await apiFetch(`/users/${id}`, { method: 'DELETE' });
      onDelete(); 
    } catch (error) {
      alert('Error al eliminar usuario');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      {/* TÍTULO VISIBLE: Añadido fuera de la tabla para asegurar visibilidad */}
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
                    {typeof user.role === 'object' && user.role !== null 
                      ? user.role.name 
                      : user.role}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
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
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}