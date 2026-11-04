import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-base-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${sizeMap[size]} animate-scale-in`}
      >
        <div className="glass rounded-2xl border-white/10 shadow-glass">
          {(title || description) && (
            <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
                {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
          )}
          <div className="px-6 py-5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
