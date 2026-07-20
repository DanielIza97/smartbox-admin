'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { ShiftsSection } from '@/components/shifts/ShiftsSection';
import { useAuth } from '@/context/AuthContext';

export default function ShiftsPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Turnos de trabajo</h1>
            <p className="text-slate-500 text-sm">Horarios recurrentes del staff de tu gimnasio.</p>
          </div>

          {!user?.gymId ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-slate-500">
              Tu cuenta no está asociada a ningún gimnasio.
            </div>
          ) : (
            <ShiftsSection gymId={user.gymId} canManage={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'} />
          )}
        </div>
      </main>
    </div>
  );
}
