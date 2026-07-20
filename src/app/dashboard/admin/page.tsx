'use client';

import { Sidebar } from '../../../components/ui/sidebar';
import { UserList } from '@/components/admin/UserList';
import { RoleManager } from '@/components/admin/RoleManager'; 

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 p-8 ml-64 space-y-8">
        <header className="border-b border-ink-line-strong pb-4">
          <h1 className="text-3xl font-extrabold text-cream tracking-tight">
            Gestión de Usuarios y Roles
          </h1>
          <p className="text-cream-muted mt-2 text-sm font-medium">
            Panel de control para la administración de acceso y permisos del sistema.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserList />
          <RoleManager />
        </div>
      </main>
    </div>
  );
}