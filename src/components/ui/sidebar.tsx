'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Inicio / Métricas', path: '/dashboard', icon: '📊' },
    { name: 'Pods SmartBox (IoT)', path: '/dashboard/pods', icon: '📦' },
    { name: 'Reservas', path: '/dashboard/reservations', icon: '📅' },
    { name: 'Usuarios y Roles', path: '/dashboard/users', icon: '👥' },
    { name: 'Historial de Pagos', path: '/dashboard/payments', icon: '💳' },
    { name: 'Auditoría y Logs', path: '/dashboard/logs', icon: '📜' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between p-4 min-h-screen fixed left-0 top-0 z-40">
      <div>
        {/* Logo / Marca */}
        <div className="mb-8 px-2 py-4 border-b border-slate-800 text-center">
          <h2 className="text-2xl font-bold text-white tracking-wider">SmartBox</h2>
          <span className="text-xs text-indigo-400 font-medium tracking-widest uppercase">
            Admin Panel
          </span>
        </div>

        {/* Menú Dinámico */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            // isActive es verdadero si estamos exactamente en la ruta o en una sub-ruta
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botón Cerrar Sesión */}
      <div className="border-t border-slate-800 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <span>🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}