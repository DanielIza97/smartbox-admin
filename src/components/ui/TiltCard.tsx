'use client';

import { useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  // Cards grandes se ven mejor con menos inclinación que las chicas.
  maxTilt?: number;
}

// Profundidad 3D sin librerías: inclina la tarjeta siguiendo el mouse
// dentro de sus límites (perspective + rotateX/rotateY), vuelve a plano
// al salir.
export function TiltCard({ children, className = '', maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transition: 'transform 0.15s ease-out' }}
      className={className}
    >
      {children}
    </div>
  );
}
