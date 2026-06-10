'use client';

import { Sidebar } from '../../../components/ui/sidebar';
import { UserList } from '@/components/admin/UserList';
import { RoleManager } from '@/components/admin/RoleManager'; 

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 ml-64 space-y-8">
        <h1 className="text-2xl font-bold">Gestión de Usuarios y Roles</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserList />
          <RoleManager />
        </div>
      </main>
    </div>
  );
}