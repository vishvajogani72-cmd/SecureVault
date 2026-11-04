interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium text-white">{label}</span>}
          {description && <span className="block text-xs text-slate-500">{description}</span>}
        </span>
      )}
      <span
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-accent-500/80 shadow-glow-sm' : 'bg-base-700'
        } ${disabled ? 'opacity-40' : ''}`}
      >
        <span
          className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
          style={{ height: 18, width: 18 }}
        />
      </span>
    </button>
  );
}
