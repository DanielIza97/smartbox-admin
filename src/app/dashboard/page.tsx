'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/ui/sidebar';

// Interfaz para tipar el usuario basado en la respuesta real de tu NestJS Auth
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Verificación del estado de autenticación en el cliente
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // 2. Simulación de lectura del perfil (En producción harías un fetch a /api/v1/auth/profile)
    try {
      setUser({
        id: '6f6cc1e6-38f0-4191-8534-3d85d71f84a2',
        email: 'admin@smartbox.com',
        name: 'Admin',
        role: 'SUPER_ADMIN',
      });
    } catch (err) {
      console.error('Error al cargar perfil de usuario', err);
    } finally {
      setIsLoading(false);
    }
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

  // Métricas de negocio alineadas al Stack IoT, Reservas y Pagos del Backend
  const systemStats = [
    { title: 'Pods SmartBox (IoT)', value: '12 / 15', sub: '3 en mantenimiento (active/offline)', color: 'border-l-teal-500', icon: '📦' },
    { title: 'Reservas Activas (Hoy)', value: '42', sub: 'Estatus: pending / active', color: 'border-l-indigo-500', icon: '📅' },
    { title: 'Ingresos de Caja (Stripe)', value: '$1,240.50', sub: 'Validados vía Webhooks', color: 'border-l-emerald-500', icon: '💳' },
    { title: 'Estado Broker EMQX', value: 'Estable', sub: 'Heartbeats ESP32 estables', color: 'border-l-amber-500', icon: '⚡' },
  ];

  // Datos de monitoreo en espejo con la capa de persistencia de tu Postgres/Prisma
  const recentReservations = [
    { id: 'RES-2026-001', user: 'Carlos Mendoza', pod: 'Pod-003', status: 'active', time: '10:00 - 12:00' },
    { id: 'RES-2026-002', user: 'Ana María Silva', pod: 'Pod-001', status: 'paid', time: '13:00 - 14:30' },
    { id: 'RES-2026-003', user: 'Kevin Ortega', pod: 'Pod-012', status: 'pending', time: '15:00 - 16:00' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Barra Lateral - Ancho fijo de 64 (16rem) */}
      <Sidebar />

      {/* Contenedor Principal */}
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        {/* Contenedor con "aire":
            - p-8: Espaciado interno en todos los lados.
            - max-w-[1400px]: Evita que en pantallas muy anchas las tablas se deformen.
            - mx-auto: Centra el contenido si la pantalla es muy grande.
        */}
        <div className="p-8 px-10 max-w-[1500px] mx-auto space-y-8">
          
          {/* Encabezado */}
          <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Panel de Control General</h1>
              <p className="text-sm text-slate-500 mt-1">
                Bienvenido de vuelta, <span className="font-semibold text-slate-700">{user?.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </header>

          {/* Grid de Tarjetas */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {systemStats.map((stat, idx) => (
              <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${stat.color} flex justify-between items-center transition-transform hover:-translate-y-1 duration-200`}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                  <span className="text-xs text-slate-500 mt-1 block">{stat.sub}</span>
                </div>
                <span className="text-2xl p-3 bg-slate-50 rounded-xl">{stat.icon}</span>
              </div>
            ))}
          </section>

          {/* Módulo de Reservas */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Monitoreo de Reservas (Módulo Base)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Sincronizado con Base de Datos PostgreSQL</p>
              </div>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Ver Gestión de Reservas →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-xs tracking-wider">
                    <th className="py-3 font-semibold">ID Reserva</th>
                    <th className="py-3 font-semibold">Usuario</th>
                    <th className="py-3 font-semibold">Cápsula Asignada</th>
                    <th className="py-3 font-semibold">Bloque Horario</th>
                    <th className="py-3 font-semibold text-right">Estado de Flujo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {recentReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 font-mono font-medium text-slate-900 text-xs">{res.id}</td>
                      <td className="py-4 font-medium">{res.user}</td>
                      <td className="py-4 text-slate-600 font-medium">{res.pod}</td>
                      <td className="py-4 text-slate-500">{res.time}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                          res.status === 'active' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                          res.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {res.status === 'active' ? 'En Uso' : res.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}