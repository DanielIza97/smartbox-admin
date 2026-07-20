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
    <header
      className="sticky top-0 z-20 border-b border-ink-line backdrop-blur-md"
      style={{ background: 'rgba(18, 17, 16, 0.82)' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-base font-black text-cream tracking-widest uppercase">SmartBox</span>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/portal' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors border-b-2 ${
                  isActive ? 'text-cream border-neon-400' : 'text-cream-muted border-transparent hover:text-cream'
                }`}
              >
                <span>{item.icon}</span> {item.name}
              </Link>
            );
          })}
          <Link
            href="/portal/profile"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors border-b-2 ${
              pathname === '/portal/profile' ? 'text-cream border-neon-400' : 'text-cream-muted border-transparent hover:text-cream'
            }`}
          >
            <span>👤</span> Mi Perfil
          </Link>
          <LogoutButton className="px-3 py-2 rounded-md text-sm font-semibold text-pop hover:bg-pop-bg transition-colors" />
        </nav>
      </div>
    </header>
  );
}
