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