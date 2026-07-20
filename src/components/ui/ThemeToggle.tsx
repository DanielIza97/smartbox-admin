'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'smartbox-theme';

// El tema "madero" (oscuro) es el default — no necesita atributo. Elegir
// "claro" agrega data-theme="light" en <html>, que globals.css usa para
// pisar los tokens de color. El script bloqueante en layout.tsx aplica
// esto mismo antes del primer paint para no mostrar un flash del tema
// que no es.
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light') setTheme('light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <button type="button" onClick={toggle} className={className}>
      {theme === 'dark' ? (
        <>☀️ Modo claro</>
      ) : (
        <>🌲 Modo madero</>
      )}
    </button>
  );
}
