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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide">Cargando SmartBox System...</p>
        </div>
      </div>
    );
  }

  const upcomingModules = [
    { title: 'Pods SmartBox (IoT)', sub: 'Control de cápsulas vía MQTT / ESP32', color: 'border-l-teal-500', icon: '📦' },
    { title: 'Reservas', sub: 'Disponibilidad y estados de reserva', color: 'border-l-indigo-500', icon: '📅' },
    { title: 'Pagos', sub: 'Cobros y conciliación de webhooks', color: 'border-l-emerald-500', icon: '💳' },
    { title: 'Monitoreo IoT', sub: 'Estado del broker y heartbeats', color: 'border-l-amber-500', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <div className="p-8 px-10 max-w-screen-2xl mx-auto space-y-8">          
          {/* Encabezado */}
          <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Panel de Control General</h1>
              <p className="text-sm text-slate-500 mt-1">
                Bienvenido de vuelta, <span className="font-semibold text-slate-700">{user?.name || 'Usuario'}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {user?.role || 'SIN ROL'}
                </span>
              </div>
            </div>
          </header>

          {/* Módulos en construcción */}
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <p className="text-sm text-slate-500">
                Reservas, pagos y monitoreo IoT todavía no están implementados en el backend —
                estas tarjetas muestran lo que vendrá, no datos en vivo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {upcomingModules.map((mod, idx) => (
                <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${mod.color} border-dashed flex justify-between items-center opacity-75`}>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{mod.title}</p>
                    <span className="text-xs text-slate-500 mt-1 block">{mod.sub}</span>
                    <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                      Próximamente
                    </span>
                  </div>
                  <span className="text-2xl p-3 bg-slate-50 rounded-xl">{mod.icon}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Accesos reales de hoy */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Disponible hoy</h2>
            <p className="text-xs text-slate-400 mb-6">Lo único conectado al backend real por ahora.</p>
            <Link
              href="/dashboard/users"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              👥 Ir a Gestión de Usuarios →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}