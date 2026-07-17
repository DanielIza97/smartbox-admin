@AGENTS.md

# CLAUDE.md — smartbox-admin

Contexto operativo para trabajar en este repo. El **documento oficial de producto** (Functional Spec, Architecture Guide, API Contract, Product Backlog, Roadmap, Definition of Done, Criterios de aceptación) es la fuente de verdad si hay conflicto con este archivo:

**https://claude.ai/code/artifact/9944c8ca-31a6-4695-b6b2-c11b8e58aeb7**

## Qué es esto

Panel de administración (Next.js 16 App Router + React 19 + Tailwind 4) de **SmartBox**, un SaaS de gestión para gimnasios. Consume el backend en [`smartbox-backend`](../smartbox-backend) vía `NEXT_PUBLIC_API_URL`. El control físico de cápsulas/lockers vía IoT es la última release del roadmap ("SmartBox IoT"), no la primera.

## Dónde estamos

- **Backend: SmartBox v1.0 completo** (Epics 0-5 — identidad, multi-tenant, membresías/Mercado Pago, reservas, operación del gimnasio, observabilidad). Este frontend va detrás: hoy consume Auth/Users (Epic 0/1), Gimnasios (Epic 1), Plans/Memberships (Epic 2) y Classes/Reservations (Epic 3) — Shifts/Reports (Epic 4) todavía no tienen ni una página. Antes de asumir que algo "no está implementado en el backend", confirmalo contra Swagger (`/docs`) — puede que ya exista y solo falte la UI.
- **Funcional hoy**: login/registro/recuperación de contraseña, gestión de usuarios (CRUD completo), perfil editable, `/unauthorized`, **Gimnasios** (`/dashboard/gyms`, SUPER_ADMIN: alta/listado/detalle) y **Configuración** (`/dashboard/settings`, ADMIN/STAFF: datos del propio gimnasio) con el flujo completo de conexión OAuth a Mercado Pago (modelo Marketplace, ver `CLAUDE.md` del backend). Sobre esa misma base, **Plan de membresía** (alta del único plan por gimnasio — SUPER_ADMIN desde el detalle del gimnasio, ADMIN desde Configuración, STAFF/CLIENT solo lectura), **Mi Membresía** (`/dashboard/membership`, CLIENT: suscribirse vía checkout hosted de Mercado Pago, ver estado/trial/vencimiento, cancelar hasta fin de período, historial de facturas — E2-07, sin UI de pago ni edición de tarjeta propia), **Clases** (`/dashboard/classes`, catálogo de turnos recurrentes semanales — SUPER_ADMIN/ADMIN dan de alta, STAFF/CLIENT solo lectura; el detalle `/dashboard/classes/:id` muestra la grilla de disponibilidad y deja reservar a CLIENT) y **Reservas** (`/dashboard/reservations`, CLIENT ve y cancela las propias; ADMIN/SUPER_ADMIN ven y cancelan las del gimnasio; STAFF solo lectura, sin botón de cancelar — así lo restringe `@Roles` en el backend). El resto del dashboard (Pods IoT, Pagos, Monitoreo IoT) sigue siendo "Próximamente" explícito, no datos inventados.
- Alineando el frontend con el backend historia por historia — Gyms, Plans/Memberships y Classes/Reservations ya están, el resto (Shifts/Reports) se va sumando en sesiones siguientes.
- **Sin GET /plans?gymId, GET /classes?gymId, ni listado admin de membresías/facturas en el backend** — `GymDetailPage` (SUPER_ADMIN) y `ClassesSection` piden la lista completa (`GET /plans`/`GET /classes`) y filtran por `gymId` en el cliente, aceptable mientras haya pocos gimnasios en v1.0; no hay forma de que un ADMIN vea el historial de facturas de otro socio (E2-07 es deliberadamente autogestión de solo lectura, sin endpoint admin-side).
- **`ClassesSection` (`src/components/classes/ClassesSection.tsx`) es el mismo patrón que `PlanCard`**: un componente compartido con props `{gymId, canManage}`, embebido tanto en `GymDetailPage` (SUPER_ADMIN, `canManage` siempre `true`) como en `/dashboard/classes` (ADMIN/STAFF/CLIENT, `gymId` resuelto de `user.gymId`, `canManage` solo para ADMIN) — no dupliques la lógica de fetch/filtro si sumás un módulo con esta misma forma (un catálogo por gimnasio que SUPER_ADMIN gestiona desde el gimnasio y el resto de roles desde su propia sección).
- **Bug real encontrado y corregido en el backend durante esta sesión (2026-07-18)**: tanto `MembershipsService.requestCancellation()` como `ReservationsService.cancel()` volvían a buscar la entidad sin la relación (`plan`/`classOrResource`) después de actualizar el status, así que la respuesta del `POST .../cancel` perdía esa info justo cuando el frontend más la necesita para seguir mostrando la fila. Si agregás un `cancel()`/`requestX()` nuevo con el mismo patrón "update + findOneOrFail", **acordate del `relations`** en el fetch final.

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
