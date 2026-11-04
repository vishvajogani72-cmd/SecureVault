import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const config: Record<ToastType, { icon: typeof CheckCircle2; color: string; ring: string }> = {
  success: { icon: CheckCircle2, color: 'text-success-400', ring: 'border-success-500/30' },
  error: { icon: XCircle, color: 'text-danger-400', ring: 'border-danger-500/30' },
  warning: { icon: AlertTriangle, color: 'text-warning-400', ring: 'border-warning-500/30' },
  info: { icon: Info, color: 'text-accent-300', ring: 'border-accent-400/30' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => {
          const { icon: Icon, color, ring } = config[t.type];
          return (
            <div
              key={t.id}
              className={`glass pointer-events-auto flex items-center gap-3 rounded-xl border ${ring} px-4 py-3 shadow-glass animate-slide-in-right`}
            >
              <Icon size={18} className={color} />
              <p className="flex-1 text-sm text-white">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="rounded-md p-1 text-slate-500 transition-colors hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
