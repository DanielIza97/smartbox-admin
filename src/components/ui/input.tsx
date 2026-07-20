'use client';

import { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Si el tipo original es password y showPassword es true, cambiamos a 'text'
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div>
      <label className="block text-sm font-medium text-cream-muted mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className="w-full pl-4 pr-12 py-2.5 bg-ink-800 border border-ink-line-strong rounded-xl text-cream placeholder-cream-faint focus:outline-none focus:ring-2 focus:ring-neon-400/20 focus:border-neon-400 transition-all text-sm"
        />

        {/* Renderiza el botón solo si el input es de tipo password */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-faint hover:text-cream-muted text-xs font-semibold px-2 py-1 select-none transition-colors"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
    </div>
  );
}