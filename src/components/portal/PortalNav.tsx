'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/ui/LogoutButton';

const NAV_ITEMS = [
  { name: 'Mi Membresía', path: '/portal', icon: '🎫' },
  { name: 'Clases', path: '/portal/classes', icon: '🧘' },
  { name: 'Mis Reservas', path: '/portal/reservations', icon: '📅' },
];

// Portal de socios (E6-02) — nav liviano, sin el sidebar operativo de
// /dashboard ("SUPER_ADMIN Panel", secciones de gestión). Solo lo que un
// CLIENT necesita autogestionar.
export function PortalNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-950 tracking-tight">SmartBox</span>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/portal' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span>{item.icon}</span> {item.name}
              </Link>
            );
          })}
          <Link
            href="/portal/profile"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/portal/profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span>👤</span> Mi Perfil
          </Link>
          <LogoutButton className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors" />
        </nav>
      </div>
    </header>
  );
}
