import { ReactNode } from 'react';
import { ClassScheduleMockup } from './ClassScheduleMockup';

interface AuthHeroLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  // El formulario de cada página (Input/Button reales) — este layout solo
  // arma el hero alrededor, la lógica de cada página no cambia.
  children: ReactNode;
}

// Layout compartido por /login, /register y /signup-gym: hero de dos
// columnas (título + formulario funcional a la izquierda, mockup
// ilustrativo del calendario de clases a la derecha) en vez de la tarjeta
// centrada que había antes. El mockup se oculta en mobile (`lg:block`) —
// abajo de ese breakpoint solo queda el título + formulario, una sola
// columna, igual que el diseño anterior.
export function AuthHeroLayout({ eyebrow, title, description, children }: AuthHeroLayoutProps) {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 py-10 lg:px-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="mb-8">
            <span className="text-xl font-black text-cream tracking-widest uppercase">SmartBox</span>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-wood-500">{eyebrow}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-cream tracking-tight leading-tight">
              {title}
            </h1>
            <p className="mt-3 text-sm text-cream-muted">{description}</p>
          </div>

          <div className="bg-ink-850 p-6 sm:p-8 rounded-2xl border border-ink-line shadow-sm">
            {children}
          </div>
        </div>

        <div className="hidden lg:block">
          <ClassScheduleMockup />
        </div>
      </div>
    </div>
  );
}
