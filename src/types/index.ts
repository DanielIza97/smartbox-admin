export interface User {
  id: string;
  name: string;
  email: string;
  role: any;
  description?: string;
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
}

// Un solo plan por gimnasio en v1.0 (unique en gym_id del lado del
// backend) — sin niveles ni descuentos, eso es E6-04 (v1.5).
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