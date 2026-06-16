import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const userRole = req.cookies.get('userRole')?.value || '';
  const { pathname } = req.nextUrl;

  // 1. Definimos los permisos actualizados para coincidir con tu sistema
  const rolePermissions: Record<string, string[]> = {
    '/dashboard/admin': ['SUPER_ADMIN', 'ADMIN'],
    '/dashboard/users': ['SUPER_ADMIN', 'ADMIN'],
    '/dashboard/payments': ['SUPER_ADMIN', 'ADMIN'],
    '/dashboard/logs': ['SUPER_ADMIN'],
    '/dashboard/pods': ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'DEVICE'],
    '/dashboard/reservations': ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CLIENT'],
  };

  // Log de depuración para ver qué llega al servidor
  console.log(`[Proxy] Ruta: ${pathname} | Rol detectado: ${userRole}`);

  const isProtected = pathname.startsWith('/dashboard');

  // 3. Si es una ruta protegida y no hay token, redirigir a login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 4. Validación de permisos
  if (isProtected) {
    for (const [route, allowedRoles] of Object.entries(rolePermissions)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          console.warn(`[Proxy] Acceso denegado a ${userRole} en ${pathname}`);
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
        // Si el rol está permitido, salimos del bucle y continuamos
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

// Mantenemos el matcher configurado
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/unauthorized'
  ],
};