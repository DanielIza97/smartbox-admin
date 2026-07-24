'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { LocationsSection } from '@/components/locations/LocationsSection';
import { useAuth } from '@/context/AuthContext';

export default function LocationsPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-cream">Sucursales</h1>
            <p className="text-cream-muted text-sm">Ubicaciones físicas de tu gimnasio.</p>
          </div>

          {!user?.gymId ? (
            <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6 text-cream-muted">
              Tu cuenta no está asociada a ningún gimnasio.
            </div>
          ) : (
            <LocationsSection gymId={user.gymId} canManage={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'} />
          )}
        </div>
      </main>
    </div>
  );
}
