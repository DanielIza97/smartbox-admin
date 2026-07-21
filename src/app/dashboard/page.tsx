'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '../../components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3. Verificación de seguridad
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center text-cream-faint">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-wood-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide">Cargando SmartBox System...</p>
        </div>
      </div>
    );
  }

  const upcomingModules = [
    { title: 'Pods SmartBox (IoT)', sub: 'Control de cápsulas vía MQTT / ESP32', color: 'border-l-wood-500', icon: '📦' },
    { title: 'Pagos', sub: 'Cobros y conciliación de webhooks', color: 'border-l-success', icon: '💳' },
    { title: 'Monitoreo IoT', sub: 'Estado del broker y heartbeats', color: 'border-l-warn', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-ink-950 flex">
      <Sidebar />

      <main className="flex-1 ml-64 bg-ink-950 min-h-screen">
        <div className="p-8 px-10 max-w-screen-2xl mx-auto space-y-8">          
          {/* Encabezado */}
          <header className="flex justify-between items-center bg-ink-850 p-6 rounded-2xl shadow-sm border border-ink-line">
            <div>
              <h1 className="text-2xl font-bold text-cream tracking-tight">Panel de Control General</h1>
              <p className="text-sm text-cream-muted mt-1">
                Bienvenido de vuelta, <span className="font-semibold text-cream-muted">{user?.name || 'Usuario'}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-neon-300 bg-ink-800 border border-wood-600/40 px-3 py-1.5 rounded-full uppercase tracking-wider">
                {user?.role || 'SIN ROL'}
              </span>
            </div>
          </header>

          {/* Módulos en construcción */}
          <section>
            <div className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6 mb-6">
              <p className="text-sm text-cream-muted">
                Pagos y monitoreo IoT ya existen en el backend, pero este panel todavía no
                tiene la pantalla para consumirlos — estas tarjetas muestran lo que vendrá
                acá, no datos en vivo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingModules.map((mod, idx) => (
                <div key={idx} className={`bg-ink-850 p-6 rounded-2xl shadow-sm border border-ink-line border-l-4 ${mod.color} border-dashed flex justify-between items-center opacity-75`}>
                  <div>
                    <p className="text-xs font-bold text-cream-faint uppercase tracking-wider">{mod.title}</p>
                    <span className="text-xs text-cream-muted mt-1 block">{mod.sub}</span>
                    <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-cream-faint bg-ink-950 px-2 py-1 rounded-full">
                      Próximamente
                    </span>
                  </div>
                  <span className="text-2xl p-3 bg-ink-950 rounded-xl">{mod.icon}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Accesos reales de hoy */}
          <section className="bg-ink-850 rounded-2xl shadow-sm border border-ink-line p-6">
            <h2 className="text-lg font-bold text-cream mb-1">Disponible hoy</h2>
            <p className="text-xs text-cream-faint mb-6">Lo único conectado al backend real por ahora.</p>
            <div className="flex flex-col gap-3">
              {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                <Link
                  href="/dashboard/users"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-neon-400 hover:text-neon-300 transition-colors"
                >
                  👥 Ir a Gestión de Usuarios →
                </Link>
              )}
              {user?.role === 'SUPER_ADMIN' && (
                <Link
                  href="/dashboard/gyms"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-neon-400 hover:text-neon-300 transition-colors"
                >
                  🏢 Ir a Gimnasios →
                </Link>
              )}
              {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-neon-400 hover:text-neon-300 transition-colors"
                >
                  ⚙️ Ir a Configuración de mi gimnasio →
                </Link>
              )}
              {user?.role !== 'SUPER_ADMIN' && (
                <Link
                  href="/dashboard/classes"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-neon-400 hover:text-neon-300 transition-colors"
                >
                  🧘 Ir a Clases →
                </Link>
              )}
              <Link
                href="/dashboard/reservations"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neon-400 hover:text-neon-300 transition-colors"
              >
                📅 Ir a Reservas →
              </Link>
              {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                <>
                  <Link
                    href="/dashboard/shifts"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-neon-400 hover:text-neon-300 transition-colors"
                  >
                    🗓️ Ir a Turnos de Staff →
                  </Link>
                  <Link
                    href="/dashboard/reports"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-neon-400 hover:text-neon-300 transition-colors"
                  >
                    📈 Ir a Reportes →
                  </Link>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}