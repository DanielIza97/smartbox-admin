'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoutButton } from './LogoutButton';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const userRole = user?.role || '';
  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  // Clases/Turnos/Reportes/Configuración operan sobre "mi propio gimnasio"
  // (resuelven gymId desde user.gymId) — SUPER_ADMIN no tiene gymId propio,
  // así que estos links eran un callejón sin salida para ese rol. La
  // función real para SUPER_ADMIN ya existe entrando por Gimnasios →
  // detalle de un gimnasio (GymDetailPage embebe las mismas secciones con
  // gymId explícito) — no se duplica acá, solo se saca el link roto.
  const menuItems = [
    { name: 'Inicio / Métricas', path: '/dashboard', icon: '📊', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Gimnasios', path: '/dashboard/gyms', icon: '🏢', roles: ['SUPER_ADMIN'] },
    { name: 'Pods SmartBox (IoT)', path: '/dashboard/pods', icon: '📦', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'DEVICE'], comingSoon: true },
    { name: 'Clases', path: '/dashboard/classes', icon: '🧘', roles: ['ADMIN', 'STAFF'] },
    { name: 'Reservas', path: '/dashboard/reservations', icon: '📅', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Turnos de Staff', path: '/dashboard/shifts', icon: '🗓️', roles: ['ADMIN', 'STAFF'] },
    { name: 'Reportes', path: '/dashboard/reports', icon: '📈', roles: ['ADMIN', 'STAFF'] },
    { name: 'Usuarios y Roles', path: '/dashboard/users', icon: '👥', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Historial de Pagos', path: '/dashboard/payments', icon: '💳', roles: ['SUPER_ADMIN', 'ADMIN'], comingSoon: true },
    { name: 'Configuración', path: '/dashboard/settings', icon: '⚙️', roles: ['ADMIN', 'STAFF'] },
    { name: 'Auditoría y Logs', path: '/dashboard/logs', icon: '📜', roles: ['SUPER_ADMIN'], comingSoon: true },
  ];

  // Filtramos los items basándonos en el rol que viene del contexto
  const filteredItems = user ? menuItems.filter(item => item.roles.includes(userRole)) : [];

  return (
    <aside
      className="sidebar-scope w-64 text-cream-muted flex flex-col justify-between p-4 min-h-screen fixed left-0 top-0 z-40 border-r border-ink-line"
      style={{ background: 'linear-gradient(185deg, var(--t-sidebar-top) 0%, var(--t-sidebar-deep) 60%)' }}
    >
      <div>
        <div className="mb-6 px-2 py-4 border-b border-ink-line text-center">
          <h2 className="text-xl font-black text-cream tracking-widest uppercase">SmartBox</h2>
          <span className="text-[11px] text-wood-500 font-bold tracking-widest uppercase">
            {userRole || 'Invitado'} Panel
          </span>
        </div>

        <nav className="space-y-0.5">
          {filteredItems.map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.path}
                  title="Próximamente"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold border-l-2 border-transparent text-cream-faint opacity-60 cursor-not-allowed"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-ink-950 px-1.5 py-0.5 rounded-full">
                    Pronto
                  </span>
                </div>
              );
            }

            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-wood-600 to-neon-500 text-white shadow-md shadow-wood-600/30'
                    : 'text-cream-muted hover:bg-ink-line hover:text-cream'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* SECCIÓN DE USUARIO: Perfil y Logout */}
      <div className="border-t border-ink-line pt-3 space-y-1">
        <Link
          href="/dashboard/profile"
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold rounded-xl transition-all ${
            pathname === '/dashboard/profile'
              ? 'bg-gradient-to-r from-wood-600 to-neon-500 text-white shadow-md shadow-wood-600/30'
              : 'text-cream-muted hover:bg-ink-line hover:text-cream'
          }`}
        >
          <span>👤</span> Mi Perfil
        </Link>

        <LogoutButton
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-pop hover:bg-pop-bg transition-colors rounded-xl"
        />

        <div className="flex items-center gap-2 px-3 pt-3 text-[11.5px] text-cream-muted">
          <div className="w-6 h-6 rounded-full bg-ink-800 border border-wood-500 flex items-center justify-center text-wood-500 font-extrabold text-[11px] shrink-0">
            {initial}
          </div>
          <span className="truncate">{user?.name || user?.email}</span>
        </div>
      </div>
    </aside>
  );
}
