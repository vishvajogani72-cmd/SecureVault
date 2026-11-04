import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, hint, trailing, className = '', id, type = 'text', ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <div
          className={`group relative flex items-center rounded-xl border bg-base-900/60 transition-all duration-200 ${
            error
              ? 'border-danger-500/50 focus-within:border-danger-500'
              : 'border-white/10 focus-within:border-accent-400/60 focus-within:shadow-glow-sm'
          } ${className}`}
        >
          {icon && <span className="pl-3.5 text-slate-500 group-focus-within:text-accent-300">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`h-11 w-full bg-transparent px-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none ${
              icon ? 'pl-2.5' : ''
            } ${trailing ? 'pr-2' : ''}`}
            {...props}
          />
          {trailing && <span className="pr-2">{trailing}</span>}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-danger-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface PasswordInputProps extends Omit<InputProps, 'type' | 'trailing'> {
  /** Extra element rendered to the right of the show/hide toggle. */
  extraTrailing?: ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ extraTrailing, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        trailing={
          <>
            {extraTrailing}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShow((s) => !s)}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:text-accent-300"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </>
        }
        {...props}
      />
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
