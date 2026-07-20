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
// Mis Reservas) — mismo lenguaje visual que ProfileContent (gradiente +
// insignia + TiltCard), para que "el resto del portal" se sienta parte
// del mismo diseño que Mi Perfil.
export function PortalPageHero({ icon, title, subtitle, action }: PortalPageHeroProps) {
  return (
    <TiltCard
      maxTilt={4}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-indigo-500/30 border border-white/20"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/30 shadow-lg text-2xl">
            {icon}
          </div>
          <div>
            <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-1">Portal de socios</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="text-indigo-100 text-sm mt-1">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
    </TiltCard>
  );
}
