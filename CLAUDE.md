@AGENTS.md

# CLAUDE.md — smartbox-admin

Contexto operativo para trabajar en este repo. El **documento oficial de producto** (Functional Spec, Architecture Guide, API Contract, Product Backlog, Roadmap, Definition of Done, Criterios de aceptación) es la fuente de verdad si hay conflicto con este archivo:

**https://claude.ai/code/artifact/9944c8ca-31a6-4695-b6b2-c11b8e58aeb7**

## Qué es esto

Panel de administración (Next.js 16 App Router + React 19 + Tailwind 4) de **SmartBox**, un SaaS de gestión para gimnasios. Consume el backend en [`smartbox-backend`](../smartbox-backend) vía `NEXT_PUBLIC_API_URL`. El control físico de cápsulas/lockers vía IoT es la última release del roadmap ("SmartBox IoT"), no la primera.

## Dónde estamos

- **Backend: SmartBox v1.0 completo** (Epics 0-5 — identidad, multi-tenant, membresías/Mercado Pago, reservas, operación del gimnasio, observabilidad), y en progreso sobre v1.5 (Epic 6). Este frontend cubre Auth/Users (Epic 0/1), Gimnasios (Epic 1), Plans/Memberships (Epic 2, incluyendo `E6-04`), Classes/Reservations (Epic 3) y Shifts/Reports (Epic 4) — alineado con todo v1.0 más lo que ya avanzó de Epic 6. Antes de asumir que algo "no está implementado en el backend", confirmalo contra Swagger (`/docs`) — puede que ya exista y solo falte la UI.
- **Funcional hoy**: login/registro/recuperación de contraseña, gestión de usuarios (CRUD completo), perfil editable, `/unauthorized`, **Gimnasios** (`/dashboard/gyms`, SUPER_ADMIN: alta/listado/detalle) y **Configuración** (`/dashboard/settings`, ADMIN/STAFF: datos del propio gimnasio) con el flujo completo de conexión OAuth a Mercado Pago (modelo Marketplace, ver `CLAUDE.md` del backend). Sobre esa misma base, **Planes de membresía** (`E6-04`, 2026-07-20: un gimnasio puede tener varios niveles/tiers — alta desde el detalle del gimnasio para SUPER_ADMIN o desde Configuración para ADMIN, STAFF/CLIENT solo lectura), **Mi Membresía** (`/dashboard/membership`, CLIENT: elige un plan de una lista y se suscribe vía checkout hosted de Mercado Pago, ve estado/trial/vencimiento, cancela hasta fin de período, historial de facturas — E2-07, sin UI de pago ni edición de tarjeta propia), **Clases** (`/dashboard/classes`, catálogo de turnos recurrentes semanales — SUPER_ADMIN/ADMIN dan de alta, STAFF/CLIENT solo lectura; el detalle `/dashboard/classes/:id` muestra la grilla de disponibilidad y deja reservar a CLIENT), **Reservas** (`/dashboard/reservations`, CLIENT ve y cancela las propias; ADMIN/SUPER_ADMIN ven y cancelan las del gimnasio; STAFF solo lectura, sin botón de cancelar — así lo restringe `@Roles` en el backend), **Turnos de Staff** (`/dashboard/shifts`, horarios de trabajo recurrentes — SUPER_ADMIN/ADMIN dan de alta, STAFF solo lectura; sin CLIENT, es operativo) y **Reportes** (`/dashboard/reports`, ocupación de clases con rango de fechas para ADMIN/STAFF/SUPER_ADMIN, ingresos + socios activos solo para ADMIN/SUPER_ADMIN — `GET /reports/revenue` es ADMIN-only en el backend). El resto del dashboard (Pods IoT, Pagos, Monitoreo IoT) sigue siendo "Próximamente" explícito, no datos inventados.
- **Sin GET /plans?gymId, GET /classes?gymId, GET /shifts?gymId, ni listado admin de membresías/facturas en el backend** — `GymDetailPage` (SUPER_ADMIN), `PlansSection`, `ClassesSection` y `ShiftsSection` piden la lista completa (`GET /plans`/`GET /classes`/`GET /shifts`) y filtran por `gymId` en el cliente, aceptable mientras haya pocos gimnasios en v1.0; no hay forma de que un ADMIN vea el historial de facturas de otro socio (E2-07 es deliberadamente autogestión de solo lectura, sin endpoint admin-side).
- **`PlansSection`/`ClassesSection`/`ShiftsSection`/`ReportsSection` son el mismo patrón**: un componente compartido con props `{gymId, canManage}` (o `canViewRevenue`/`mercadoPagoConnected` según el módulo), embebido tanto en `GymDetailPage` (SUPER_ADMIN, siempre con permiso total) como en su propia página bajo `/dashboard/<módulo>` (ADMIN/STAFF/CLIENT según corresponda, `gymId` resuelto de `user.gymId`) — no dupliques la lógica de fetch/filtro si sumás un módulo con esta misma forma (un catálogo o vista por gimnasio que SUPER_ADMIN gestiona desde el gimnasio y el resto de roles desde su propia sección). `PlansSection` reemplazó a un `PlanCard` más viejo (pensado para un solo plan por gimnasio) cuando `E6-04` sumó múltiples planes — si ves referencias a `PlanCard` en memoria/docs viejos, es el nombre anterior de este mismo componente.
- **`POST /memberships/subscribe` ahora exige `{ planId }` en el body** (antes no recibía body, resolvía "el" plan del gimnasio solo) — `MembershipStatusCard` le muestra al socio una lista de planes (radio buttons) antes de habilitar "Suscribirme"; sin plan seleccionado, el botón queda deshabilitado. Si `plans` llega vacío (gimnasio sin planes configurados), se muestra un mensaje en vez del picker.
- **`POST /shifts` no devuelve la relación `staff`** (a diferencia de `GET /shifts`, que sí la trae) — `ShiftsSection.onSuccess` completa el nombre a mano desde `staffOptions` (ya cargado para el selector del modal) en vez de pedirle al backend que la incluya, para no tener que re-fetchear toda la lista tras cada alta. Si un patrón similar aparece en un módulo nuevo (alta que no devuelve una relación que la tabla necesita para pintarse), preferí este mismo truco de completar client-side antes que forzar un round-trip extra.
- **Bugs reales encontrados y corregidos en el backend durante estas sesiones**: `MembershipsService.requestCancellation()`, `ReservationsService.cancel()` (2026-07-18) y `ShiftsService.findAll()` para SUPER_ADMIN (2026-07-20) — los dos primeros volvían a buscar la entidad sin la relación (`plan`/`classOrResource`) después de actualizar el status, y el tercero no traía `staff.gym` en la rama de SUPER_ADMIN, rompiendo el filtro por `gymId` en `ShiftsSection`. Si agregás un `cancel()`/`requestX()`/`findAll()` nuevo con este patrón, **acordate de las `relations`** que el frontend necesita para pintar o filtrar la respuesta.

## ⚠️ Este Next.js no es el que conocés

Next.js 16 renombró `middleware.ts` → **`proxy.ts`** (función exportada `proxy`, no `middleware`). `middleware.ts` sigue funcionando pero está deprecado y lo marca así el propio dev server. Este repo ya usa la convención correcta (`src/proxy.ts`) — no lo "corrijas" de vuelta a `middleware.ts`, ya pasó una vez. Ante cualquier otra duda de convención de Next.js, revisá `node_modules/next/dist/docs/` antes de asumir por entrenamiento previo (ver `AGENTS.md`).

## Stack y comandos

```bash
npm run dev      # next dev -p 3000
npm run build
npm run lint      # eslint (config-next core-web-vitals + typescript)
npx tsc --noEmit  # typecheck
```

Sin infraestructura de tests todavía (ni Jest ni Vitest instalados) — ver Epic 0 / E0-12 en el documento oficial.

## Convenciones establecidas — no las rompas sin razón

- Todas las llamadas al backend pasan por `apiFetch` (`src/lib/api.ts`), que agrega el `Authorization: Bearer` desde `localStorage` y maneja el 401 → logout automático.
- Estado de sesión: `AuthContext` (`src/context/AuthContext.tsx`). Usá `updateUser(partial)` para reflejar cambios del propio usuario (nombre, etc.) sin forzar un re-login — no dupliques la lógica de `localStorage.setItem('user', ...)` en cada componente.
- El JWT vive en `localStorage` + una cookie no-httpOnly (para que `proxy.ts` pueda leer el rol) — es un gap de seguridad conocido y documentado (ver Recomendaciones / Epic 0), no lo "arregles" a medias sin revisar el resto del flujo de auth.
- Guards de ruta por rol: `src/proxy.ts` lee las cookies `token`/`userRole` — si agregás una ruta nueva bajo `/dashboard`, sumala a `rolePermissions` ahí, no confíes solo en que el sidebar la oculte (eso es UX, no seguridad).
- Nada de `console.log` de depuración, especialmente si loguea tokens o payloads de auth (`console.error` para manejo real de errores sí está establecido, ver `UserTable.tsx`/`GymsPage`).
- Antes de asumir que un endpoint del backend existe, confirmalo contra el API Contract del documento oficial o contra Swagger (`/docs` del backend) — el backend (Epics 0-5) va muy adelante de este frontend, así que lo más probable es que el endpoint SÍ exista y solo falte la página acá.
- Patrón para un módulo nuevo que consume el backend (ver `src/app/dashboard/gyms/`, `src/components/gyms/` como referencia): tipo en `src/types/index.ts`, página(s) bajo `src/app/dashboard/<módulo>/`, componentes de UI en `src/components/<módulo>/`, todo vía `apiFetch`; agregar el permiso de ruta en `src/proxy.ts` y la entrada en el sidebar (`src/components/ui/sidebar.tsx`) en el mismo cambio — no alcanza con uno solo de los dos.
- Cualquier página que use `useSearchParams()` de `next/navigation` necesita un `<Suspense>` alrededor (`npm run build` falla si no) — extraé la parte que lo usa a un componente aparte si el resto de la página no lo necesita (ver `dashboard/settings/page.tsx`).
- Deuda de lint preexistente, no introducida por sesiones recientes — no la arregles de paso dentro de un cambio no relacionado, es su propia historia: `role: any` en el `User` de `src/types/index.ts`, algunos `any`/imports sin usar sueltos, y `react-hooks/set-state-in-effect` (React Compiler) en casi cualquier página que siga el patrón `useEffect(() => { load(); }, [load])` — es el patrón de carga de datos establecido en todo el dashboard (`users/page.tsx`, `AuthContext.tsx`, `gyms/`, `settings/`, `membership/`, etc.), así que no vale la pena pelearlo página por página; medí contra `git stash` antes de asumir que un cambio tuyo sumó deuda nueva, `npm run lint` ya marca ~17 problemas en el baseline actual sin tocar nada.

## Definition of Done (ver documento oficial §06 para el detalle completo)

- [ ] `npx tsc --noEmit` sin errores
- [ ] `npm run lint` sin errores nuevos
- [ ] Probado en el navegador de punta a punta (login real si el flujo lo requiere), no solo que compile
- [ ] Sin `console.log` ni datos fabricados presentados como reales (si un módulo no está listo, un estado "Próximamente" explícito, no una tarjeta con números inventados)
- [ ] Commits en este repo: **sin** el trailer `Co-Authored-By`
- [ ] Formato de commit [Conventional Commits](https://www.conventionalcommits.org/): `<tipo>(<alcance>): <descripción>` (ej.: `fix(dashboard): remove fabricated metrics`). Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
