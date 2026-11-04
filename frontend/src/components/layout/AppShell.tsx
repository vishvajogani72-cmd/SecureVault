import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  KeyRound,
  Sparkles,
  Settings,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useNav, type Route } from '@/context/NavContext';
import { useAuth } from '@/context/AuthContext';

const navItems: { route: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'passwords', label: 'Vault', icon: KeyRound },
  { route: 'generator', label: 'Generator', icon: Sparkles },
  { route: 'settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { route, navigate } = useNav();
  const { user, lock, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/[0.06] bg-base-900/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo size="sm" />
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        {navItems.map((item) => {
          const active = route === item.route;
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => handleNav(item.route)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-accent-500/10 text-accent-200'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full border-l-2 border-accent-400" />
              )}
              <Icon
                size={18}
                className={active ? 'text-accent-300' : 'text-slate-500 group-hover:text-slate-300'}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/[0.06] p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent-500/40 to-accent-700/20 text-sm font-semibold text-accent-200">
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.username ?? 'User'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email ?? '—'}</p>
          </div>
        </div>
        <button
          onClick={lock}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-accent-200"
        >
          <Lock size={18} className="text-slate-500" />
          Lock vault
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-danger-500/10 hover:text-danger-400"
        >
          <X size={18} className="text-slate-500" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="relative z-10 flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-base-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full animate-slide-in-right">{sidebar}</div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-base-900/50 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <Logo size="sm" />
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
