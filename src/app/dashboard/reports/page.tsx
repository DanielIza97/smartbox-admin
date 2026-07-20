'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { ReportsSection } from '@/components/reports/ReportsSection';
import { useAuth } from '@/context/AuthContext';

export default function ReportsPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
            <p className="text-slate-500 text-sm">Ocupación de clases e ingresos de tu gimnasio.</p>
          </div>

          {!user?.gymId ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-slate-500">
              Tu cuenta no está asociada a ningún gimnasio.
            </div>
          ) : (
            <ReportsSection gymId={user.gymId} canViewRevenue={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'} />
          )}
        </div>
      </main>
    </div>
  );
}
