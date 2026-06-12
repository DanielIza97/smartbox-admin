'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UserTable } from '@/components/admin/UserTable';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { EditUserModal } from '@/components/admin/EditUserModal';
import { apiFetch } from '@/lib/api';
import { User, Role } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  // Iniciamos en false para evitar el primer cambio de estado al montar
  const [loading, setLoading] = useState(false); 
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const loadData = useCallback(async () => {
    try {
      // Solo activamos el loading si ya tenemos datos, si no, es carga inicial silenciosa
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        apiFetch('/users'),
        apiFetch('/roles'),
      ]);

      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();

      setUsers(Array.isArray(usersData) ? usersData : (usersData.users || []));
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Patrón recomendado: ejecutar la función directamente
    loadData();
  }, [loadData]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
              <p className="text-slate-500 text-sm">Administra los accesos y roles del sistema.</p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <span>👤+</span> Crear Usuario
            </button>
          </div>

          {/* Si loading es true, mostramos carga. Si es la primera carga, se ve el spinner */}
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              Cargando datos...
            </div>
          ) : (
            <UserTable
              users={users}
              onDelete={loadData}
              onEdit={(user) => {
                setUserToEdit(user);
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      </main>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        roles={roles}
        onSuccess={() => {
          loadData();
          setIsCreateModalOpen(false);
        }}
      />

      <EditUserModal
        key={userToEdit?.id || 'new'}
        isOpen={isEditModalOpen}
        user={userToEdit}
        onClose={() => setIsEditModalOpen(false)}
        roles={roles}
        onSuccess={() => {
          loadData();
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
}