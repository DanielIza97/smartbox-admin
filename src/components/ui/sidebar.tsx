'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoutButton } from './LogoutButton';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const userRole = user?.role || '';
  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  const menuItems = [
    { name: 'Inicio / Métricas', path: '/dashboard', icon: '📊', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Gimnasios', path: '/dashboard/gyms', icon: '🏢', roles: ['SUPER_ADMIN'] },
    { name: 'Pods SmartBox (IoT)', path: '/dashboard/pods', icon: '📦', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'DEVICE'] },
    { name: 'Clases', path: '/dashboard/classes', icon: '🧘', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Reservas', path: '/dashboard/reservations', icon: '📅', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Turnos de Staff', path: '/dashboard/shifts', icon: '🗓️', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Reportes', path: '/dashboard/reports', icon: '📈', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Usuarios y Roles', path: '/dashboard/users', icon: '👥', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Historial de Pagos', path: '/dashboard/payments', icon: '💳', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Configuración', path: '/dashboard/settings', icon: '⚙️', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Auditoría y Logs', path: '/dashboard/logs', icon: '📜', roles: ['SUPER_ADMIN'] },
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
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold transition-all border-l-2 ${
                  isActive
                    ? 'bg-ink-line text-cream border-wood-500'
                    : 'text-cream-muted border-transparent hover:bg-ink-line hover:text-cream'
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
        <ThemeToggle className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-cream-muted hover:bg-ink-line hover:text-cream transition-all border-l-2 border-transparent" />

        <Link
          href="/dashboard/profile"
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold border-l-2 transition-all ${
            pathname === '/dashboard/profile' ? 'bg-ink-line text-cream border-wood-500' : 'text-cream-muted border-transparent hover:bg-ink-line hover:text-cream'
          }`}
        >
          <span>👤</span> Mi Perfil
        </Link>

        <LogoutButton
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-pop hover:bg-pop-bg transition-colors border-l-2 border-transparent"
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
