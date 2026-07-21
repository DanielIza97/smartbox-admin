'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UserTable } from '@/components/admin/UserTable';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { EditUserModal } from '@/components/admin/EditUserModal';
import { apiFetch } from '@/lib/api';
import { User, Role } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [gymFilter, setGymFilter] = useState('ALL');

  // Gimnasios distintos presentes en la lista ya cargada — para ADMIN/STAFF
  // (que solo ven su propio gym) esto da como mucho 1 opción, así que el
  // selector de gimnasio se oculta solo (ver más abajo); para SUPER_ADMIN,
  // que ve todos los gimnasios mezclados, refleja los que realmente
  // aparecen en la tabla.
  const gymOptions = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((u) => {
      if (u.gym) map.set(u.gym.id, u.gym.name);
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const roleName = typeof u.role === 'object' && u.role !== null ? u.role.name : u.role;
      const matchesRole = roleFilter === 'ALL' || roleName === roleFilter;
      const matchesGym = gymFilter === 'ALL' || u.gym?.id === gymFilter;
      return matchesSearch && matchesRole && matchesGym;
    });
  }, [users, search, roleFilter, gymFilter]);

  const filtersActive = search.trim() !== '' || roleFilter !== 'ALL' || gymFilter !== 'ALL';

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('ALL');
    setGymFilter('ALL');
  };

  const loadData = useCallback(async () => {
    try {
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
    loadData();
  }, [loadData]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-cream">Gestión de Usuarios</h1>
              <p className="text-cream-muted text-sm">Administra los accesos y roles del sistema.</p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-wood-600 hover:bg-wood-500 text-cream font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <span>👤+</span> Crear Usuario
            </button>
          </div>

          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-cream-muted">
              Cargando datos...
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="flex-1 min-w-[220px] px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream placeholder:text-cream-faint focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
                />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
                >
                  <option value="ALL">Todos los roles</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>

                {gymOptions.length > 1 && (
                  <select
                    value={gymFilter}
                    onChange={(e) => setGymFilter(e.target.value)}
                    className="px-4 py-2.5 bg-ink-850 border border-ink-line-strong rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all"
                  >
                    <option value="ALL">Todos los gimnasios</option>
                    {gymOptions.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                )}

                {filtersActive && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-cream-muted hover:text-cream transition-colors px-2"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <UserTable
                users={filteredUsers}
                emptyMessage={
                  filtersActive
                    ? 'Ningún usuario coincide con los filtros aplicados.'
                    : undefined
                }
                onDelete={loadData}
                onEdit={(user) => {
                  setUserToEdit(user);
                  setIsEditModalOpen(true);
                }}
              />
            </>
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

      {/* Renderizado condicional: Solo existe el modal si hay un usuario seleccionado */}
      {userToEdit && (
        <EditUserModal
          key={userToEdit.id}
          isOpen={isEditModalOpen}
          user={userToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setUserToEdit(null); 
          }}
          roles={roles}
          onSuccess={() => {
            loadData();
            setIsEditModalOpen(false);
            setUserToEdit(null);
          }}
        />
      )}
    </div>
  );
}