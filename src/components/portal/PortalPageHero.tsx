'use client';

import type { ReactNode } from 'react';
import { TiltCard } from '@/components/ui/TiltCard';

interface PortalPageHeroProps {
  icon: string;
  title: string;
  subtitle: string;
  // Acción opcional alineada a la derecha (ej. "+ Nueva reserva").
  action?: ReactNode;
}

// Encabezado compartido de las páginas del portal (Mi Membresía, Clases,
// Mis Reservas) — mismo lenguaje visual que ProfileContent y el resto de
// la identidad "gimnasio boutique": panel de tinta, título tipo cartel
// en mayúsculas con una línea de neón, insignia con acento de madera.
export function PortalPageHero({ icon, title, subtitle, action }: PortalPageHeroProps) {
  return (
    <TiltCard
      maxTilt={4}
      className="relative overflow-hidden bg-ink-850 p-8 md:p-10 rounded-2xl border border-ink-line shadow-2xl"
      style={{ boxShadow: '0 24px 48px -26px rgba(0,0,0,0.7)' }}
    >
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink-800 border border-wood-500 text-2xl">
            {icon}
          </div>
          <div>
            <p className="text-wood-500 font-bold text-[10.5px] uppercase tracking-[0.14em] mb-1.5">Portal de socios</p>
            <h1 className="text-3xl md:text-4xl font-black text-cream tracking-tight uppercase leading-none mb-2.5">{title}</h1>
            <span
              className="block w-16 h-0.5 bg-neon-400 mb-2.5"
              style={{ boxShadow: '0 0 10px rgba(127,227,240,0.35)' }}
            />
            <p className="text-cream-muted text-sm">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
    </TiltCard>
  );
}
