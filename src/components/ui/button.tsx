import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'ghost' | 'secondary'; 
}

export function Button({ 
  children, 
  isLoading, 
  variant = 'primary', 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "w-full mt-2 py-3 px-4 font-medium rounded-xl transition-all text-sm shadow-sm flex items-center justify-center disabled:opacity-70";
  
  const variantStyles = {
    primary: "bg-wood-600 hover:bg-wood-500 text-cream disabled:bg-wood-700",
    ghost: "bg-transparent text-cream-muted hover:bg-ink-line border border-ink-line-strong",
    secondary: "bg-ink-800 text-cream hover:bg-ink-700 disabled:bg-ink-850 border border-ink-line"
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}