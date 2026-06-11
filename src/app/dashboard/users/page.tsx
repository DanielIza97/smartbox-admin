'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UserTable } from '@/components/admin/UserTable';
import { CreateUserModal } from '@/components/admin/CreateUserModal'; 
import { apiFetch } from '@/lib/api';
import { User, Role } from '@/types'; 

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]); 
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargamos usuarios y roles en paralelo
      const [usersRes, rolesRes] = await Promise.all([
        apiFetch('/users'),
        apiFetch('/roles')
      ]);
      
      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();
      
      setUsers(Array.isArray(usersData) ? usersData : (usersData.users || []));
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <span>👤+</span> Crear Usuario
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              Cargando datos...
            </div>
          ) : (
            <UserTable users={users} onDelete={loadData} />
          )}
        </div>
      </main>

      {/* Modal Reutilizable */}
      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        roles={roles}
        onSuccess={() => {
          loadData(); // Recargamos la tabla al crear un usuario nuevo
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}