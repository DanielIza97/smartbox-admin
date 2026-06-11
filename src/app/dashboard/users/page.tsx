'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UserTable } from '@/components/admin/UserTable';
import { apiFetch } from '@/lib/api';
import { User } from '@/types'; 

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/users');
      const data = await res.json();
      
      const usersArray = Array.isArray(data) ? data : (data.users || []);
      setUsers(usersArray);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      
      <main className="flex-1 pl-64 w-full">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
            <p className="text-slate-500 text-sm">Administra los accesos y roles del sistema.</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              Cargando usuarios...
            </div>
          ) : (
            <UserTable users={users} onDelete={loadUsers} />
          )}
        </div>
      </main>
    </div>
  );
}