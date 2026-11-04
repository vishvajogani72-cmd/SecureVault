import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-accent-500 to-accent-400 text-base-950 font-semibold hover:from-accent-400 hover:to-accent-300 shadow-glow-sm hover:shadow-glow disabled:opacity-50',
  secondary:
    'bg-base-750/80 text-accent-200 border border-accent-400/30 hover:bg-base-700/80 hover:border-accent-400/50 disabled:opacity-50',
  outline:
    'bg-transparent text-accent-200 border border-white/15 hover:border-accent-400/40 hover:text-accent-100 disabled:opacity-40',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white disabled:opacity-40',
  danger:
    'bg-danger-500/15 text-danger-400 border border-danger-500/40 hover:bg-danger-500/25 hover:border-danger-500/60 disabled:opacity-50',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-7 text-base gap-2.5 rounded-xl py-3.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading = false, fullWidth = false, className = '', children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`relative inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] select-none ${
          variants[variant]
        } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          </span>
        )}
        <span className={loading ? 'opacity-0' : 'inline-flex items-center justify-center gap-2'}>
          {children}
        </span>
      </button>
    );
  },
);
Button.displayName = 'Button';
