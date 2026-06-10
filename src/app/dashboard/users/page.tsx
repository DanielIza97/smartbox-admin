// src/app/dashboard/users/page.tsx
'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { UserList } from '@/components/admin/UserList';
import { RoleManager } from '@/components/admin/RoleManager';

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 space-y-8">
        <h1 className="text-2xl font-bold">Gestión de Usuarios y Roles</h1>
        
        {/* Aquí estás usando los componentes que creaste en la carpeta components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserList />
          <RoleManager />
        </div>
      </main>
    </div>
  );
}