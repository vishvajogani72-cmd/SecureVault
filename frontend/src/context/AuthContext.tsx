

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Session, User } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (username: string, masterPassword: string) => Promise<boolean>;
  register: (username: string, masterPassword: string, email?: string) => Promise<boolean>;
  logout: () => void;
  lock: () => Promise<void>;

  autoLockEnabled: boolean;
  setAutoLockEnabled: (enabled: boolean) => void;

  clipboardClearEnabled: boolean;
  setClipboardClearEnabled: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  const [autoLockEnabled, setAutoLockEnabled] = useState(() => {
  return localStorage.getItem('securevault_auto_lock') !== 'false';
});

  const [clipboardClearEnabled, setClipboardClearEnabled] = useState(() => {
  return localStorage.getItem('securevault_clipboard_clear') !== 'false';
});
  useEffect(() => {
  localStorage.setItem('securevault_auto_lock', String(autoLockEnabled));
}, [autoLockEnabled]);

useEffect(() => {
  localStorage.setItem(
    'securevault_clipboard_clear',
    String(clipboardClearEnabled)
  );
}, [clipboardClearEnabled]);
  const setSession = (session: Session | null) => {
    setState((s) => ({
      ...s,
      user: session?.user ?? null,
      token: session?.token ?? null,
      loading: false,
      error: session ? null : s.error,
    }));
  };

  const login = useCallback(
    async (username: string, masterPassword: string) => {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const session = await api.login(username, masterPassword);
        setSession(session);
        return true;
      } catch (e) {
        setState((s) => ({
          ...s,
          loading: false,
          error: (e as Error).message,
        }));
        return false;
      }
    },
    []
  );

  const register = useCallback(
    async (username: string, masterPassword: string, email?: string) => {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const session = await api.register(username, masterPassword, email);
        setSession(session);
        return true;
      } catch (e) {
        setState((s) => ({
          ...s,
          loading: false,
          error: (e as Error).message,
        }));
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    const currentToken = state.token;

    if (currentToken) {
      void api.logout(currentToken).catch((error) => {
        console.error('Backend logout failed:', error);
      });
    }

    setState({
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  }, [state.token]);

  const lock = useCallback(async () => {
    const currentToken = state.token;

    try {
      if (currentToken) {
        await api.logout(currentToken);
      }
    } catch (error) {
      console.error('Backend lock request failed:', error);
    } finally {
      setState((s) => ({
        ...s,
        token: null,
        error: null,
      }));
    }
  }, [state.token]);

  // Automatically lock after 10 minutes without activity.
  useEffect(() => {
    if (!state.token || !autoLockEnabled) return;

    const AUTO_LOCK_TIME = 10 * 60 * 1000;
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        void lock();
      }, AUTO_LOCK_TIME);
    };

    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [state.token, autoLockEnabled, lock]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        lock,
        autoLockEnabled,
        setAutoLockEnabled,
        clipboardClearEnabled,
        setClipboardClearEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
