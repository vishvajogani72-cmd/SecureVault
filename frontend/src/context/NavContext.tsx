import { createContext, useContext, useState, type ReactNode } from 'react';

export type Route = 'dashboard' | 'passwords' | 'generator' | 'settings';

interface NavContextValue {
  route: Route;
  navigate: (r: Route) => void;
}

const NavContext = createContext<NavContextValue | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('dashboard');
  const navigate = (r: Route) => {
    setRoute(r);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <NavContext.Provider value={{ route, navigate }}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
