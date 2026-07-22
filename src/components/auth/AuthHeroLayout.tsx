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
    <div className="relative min-h-screen bg-ink-950 overflow-hidden flex items-center justify-center px-4 py-10 lg:px-10">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-wood-600/25 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-neon-500/20 blur-[100px]" />

      {/* items-start (no items-center): con formularios de largo distinto
          (login corto vs. signup-gym largo), centrar la fila hacía que el
          mockup quedara descolgado respecto al inicio del formulario. Con
          items-start ambas columnas arrancan en el mismo borde superior;
          el mockup queda `sticky` para acompañar el scroll en el
          formulario más largo en vez de quedar huérfano arriba. */}
      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="mb-8">
            <span className="text-xl font-black text-cream tracking-widest uppercase">SmartBox</span>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-neon-400">{eyebrow}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight leading-tight bg-gradient-to-r from-cream to-wood-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="mt-3 text-sm text-cream-muted">{description}</p>
          </div>

          <div className="bg-ink-850 p-6 sm:p-8 rounded-2xl border border-ink-line shadow-xl">
            {children}
          </div>
        </div>

        <div className="hidden lg:block lg:sticky lg:top-16">
          <ClassScheduleMockup />
        </div>
      </div>
    </div>
  );
}
