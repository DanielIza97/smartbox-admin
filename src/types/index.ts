export interface User {
  id: string;
  name: string;
  email: string;
  role: any;
  description?: string;
  // Presente en GET /users (relations: role, gym) — ausente en el User
  // más liviano de AuthContext.
  gym?: { id: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Gym {
  id: string;
  name: string;
  address?: string;
  timezone: string;
  // Presente (no null) una vez que el gimnasio completó el OAuth con
  // Mercado Pago — modelo Marketplace, ver CLAUDE.md del backend. Los
  // tokens en sí nunca viajan al frontend (select: false en el backend).
  mercadoPagoUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Solo presente en GET /gyms (panel multi-tenant SUPER_ADMIN, E6-05
  // segunda mitad) — el backend lo agrega con un query agrupado, no es
  // una columna real de la entidad.
  activeMembersCount?: number;
}

// Un gimnasio puede tener varios planes (niveles/tiers, E6-04) — sin
// descuentos ni cupones todavía, eso quedó fuera del alcance de E6-04.
export interface Plan {
  id: string;
  name: string;
  priceCents: number;
  gymId: string;
  mercadoPagoPlanId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Sin 'pending' — el trial de 14 días da acceso inmediato, así que nace
// 'active'. Ver la sesión de scoping de billing en el CLAUDE.md del backend.
export type MembershipStatus = 'active' | 'past_due' | 'cancelled';

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  plan?: Plan;
  status: MembershipStatus;
  mercadoPagoPreapprovalId?: string | null;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Registro interno de facturación (E2-06), solo lectura — status es el
// string crudo del Payment de Mercado Pago, no un union acotado.
export interface Invoice {
  id: string;
  membershipId: string;
  amountCents: number;
  status: string;
  mercadoPagoPaymentId: string;
  paidAt?: string | null;
  createdAt?: string;
}

// Plantilla recurrente semanal (Epic 3 · E3-01) — una fila = un turno que se
// repite todas las semanas (p. ej. "Yoga" lunes 09:00). Las ocurrencias
// reservables se derivan de este patrón en el momento, no viven en una
// tabla aparte — ver GET /classes/:id/availability.
export interface ClassOrResource {
  id: string;
  gymId: string;
  name: string;
  capacity: number;
  // 0 = domingo ... 6 = sábado.
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailabilitySlot {
  startAt: string;
  endAt: string;
  capacity: number;
  available: number;
}

// Sin 'pending'/'active'/'finished' — esos estaban pensados para el
// check-in físico de Epic 8 (IoT), todavía sin diseñar.
export type ReservationStatus = 'confirmed' | 'cancelled' | 'expired';

export interface Reservation {
  id: string;
  userId: string;
  classId: string;
  classOrResource?: ClassOrResource;
  startAt: string;
  endAt: string;
  status: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Horario de trabajo recurrente de un STAFF (E4-02) — desacoplado de
// ClassOrResource a propósito, responde "qué días/horas trabaja cada
// empleado", no "quién dicta esta clase". Sin CLIENT en ningún endpoint,
// es operativo.
export interface Shift {
  id: string;
  staffId: string;
  staff?: { id: string; name: string; email?: string; gym?: { id: string } };
  // 0 = domingo ... 6 = sábado.
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OccupancySlot {
  classId: string;
  className: string;
  startAt: string;
  endAt: string;
  capacity: number;
  booked: number;
  occupancyRate: number;
}

export interface OccupancyReport {
  from: string;
  to: string;
  slots: OccupancySlot[];
  averageOccupancyRate: number;
}

export interface RevenueDay {
  date: string;
  totalCents: number;
}

export interface RevenueReport {
  from: string;
  to: string;
  days: RevenueDay[];
  totalCents: number;
  activeMembersCount: number;
}