'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoutButton } from './LogoutButton';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userRole = user?.role || '';

  const menuItems = [
    { name: 'Inicio / Métricas', path: '/dashboard', icon: '📊', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Gimnasios', path: '/dashboard/gyms', icon: '🏢', roles: ['SUPER_ADMIN'] },
    { name: 'Pods SmartBox (IoT)', path: '/dashboard/pods', icon: '📦', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'DEVICE'] },
    { name: 'Clases', path: '/dashboard/classes', icon: '🧘', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CLIENT'] },
    { name: 'Reservas', path: '/dashboard/reservations', icon: '📅', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CLIENT'] },
    { name: 'Mi Membresía', path: '/dashboard/membership', icon: '🎫', roles: ['CLIENT'] },
    { name: 'Usuarios y Roles', path: '/dashboard/users', icon: '👥', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Historial de Pagos', path: '/dashboard/payments', icon: '💳', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Configuración', path: '/dashboard/settings', icon: '⚙️', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    { name: 'Auditoría y Logs', path: '/dashboard/logs', icon: '📜', roles: ['SUPER_ADMIN'] },
  ];

  // Filtramos los items basándonos en el rol que viene del contexto
  const filteredItems = user ? menuItems.filter(item => item.roles.includes(userRole)) : [];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between p-4 min-h-screen fixed left-0 top-0 z-40">
      <div>
        <div className="mb-8 px-2 py-4 border-b border-slate-800 text-center">
          <h2 className="text-2xl font-bold text-white tracking-wider">SmartBox</h2>
          <span className="text-xs text-indigo-400 font-medium tracking-widest uppercase">
            {userRole || 'Invitado'} Panel
          </span>
        </div>

        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* SECCIÓN DE USUARIO: Perfil y Logout */}
      <div className="border-t border-slate-800 pt-4 space-y-2">
        <Link
          href="/dashboard/profile"
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
            pathname === '/dashboard/profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span>👤</span> Mi Perfil
        </Link>
        
        <LogoutButton 
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors" 
        />
      </div>
    </aside>
  );
}