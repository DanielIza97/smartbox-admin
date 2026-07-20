import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const userRole = req.cookies.get('userRole')?.value || '';
  const { pathname } = req.nextUrl;

  // Permisos por sección del dashboard.
  const rolePermissions: Record<string, string[]> = {
    '/dashboard/admin': ['SUPER_ADMIN', 'ADMIN'],
    '/dashboard/users': ['SUPER_ADMIN', 'ADMIN'],
    '/dashboard/payments': ['SUPER_ADMIN', 'ADMIN'],
    '/dashboard/logs': ['SUPER_ADMIN'],
    '/dashboard/pods': ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'DEVICE'],
    '/dashboard/reservations': ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CLIENT'],
    // Catálogo de clases/turnos recurrentes (Epic 3) — mismos roles que
    // GET /classes en el backend; el alta queda restringida server-side a
    // SUPER_ADMIN/ADMIN.
    '/dashboard/classes': ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CLIENT'],
    // Alta/listado de gimnasios (tenants) — solo SUPER_ADMIN, igual que el backend.
    '/dashboard/gyms': ['SUPER_ADMIN'],
    // El propio gimnasio del solicitante (conexión Mercado Pago) — mismos
    // roles que GET /gyms/:id en el backend.
    '/dashboard/settings': ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
    // Autogestión de la propia membresía (E2-07) — solo CLIENT, mismos
    // roles que POST /memberships/subscribe y GET /memberships/me.
    '/dashboard/membership': ['CLIENT'],
    // Turnos de trabajo del STAFF (E4-02) — operativo, sin CLIENT, igual
    // que GET /shifts en el backend.
    '/dashboard/shifts': ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
    // Reportes de ocupación/ingresos (E4-03) — GET /reports/revenue es
    // ADMIN-only en el backend, pero la página igual es visible para STAFF
    // (solo ve ocupación); sin CLIENT.
    '/dashboard/reports': ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
  };

  const isProtected = pathname.startsWith('/dashboard');

  // Ruta protegida sin token: al login.
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validación de permisos por sección.
  if (isProtected) {
    for (const [route, allowedRoles] of Object.entries(rolePermissions)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/unauthorized'],
};
