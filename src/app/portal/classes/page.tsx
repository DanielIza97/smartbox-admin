'use client';

import { ClassesSection } from '@/components/classes/ClassesSection';
import { useAuth } from '@/context/AuthContext';

export default function PortalClassesPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clases</h1>
        <p className="text-slate-500 text-sm">Turnos recurrentes semanales de tu gimnasio.</p>
      </div>

      {!user?.gymId ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-slate-500">
          Tu cuenta no está asociada a ningún gimnasio.
        </div>
      ) : (
        <ClassesSection gymId={user.gymId} canManage={false} detailBasePath="/portal/classes" />
      )}
    </div>
  );
}
