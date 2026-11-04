import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Credential } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface VaultContextValue {
  credentials: Credential[];
  loading: boolean;
  error: string | null;
  addCredential: (input: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Credential>;
  updateCredential: (id: string, patch: Partial<Credential>) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setCredentials([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await api.listCredentials(token);
      setCredentials(list);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addCredential = useCallback<VaultContextValue['addCredential']>(
    async (input) => {
      const created = await api.createCredential(token!, input);
      setCredentials((c) => [created, ...c]);
      return created;
    },
    [token],
  );

  const updateCredential = useCallback<VaultContextValue['updateCredential']>(
    async (id, patch) => {
      const updated = await api.updateCredential(token!, id, patch);
      setCredentials((c) => c.map((x) => (x.id === id ? updated : x)));
    },
    [token],
  );

  const deleteCredential = useCallback<VaultContextValue['deleteCredential']>(
    async (id) => {
      await api.deleteCredential(token!, id);
      setCredentials((c) => c.filter((x) => x.id !== id));
    },
    [token],
  );

  const toggleFavorite = useCallback<VaultContextValue['toggleFavorite']>(
    async (id) => {
      const current = credentials.find((c) => c.id === id);
      if (!current) return;
      await updateCredential(id, { favorite: !current.favorite });
    },
    [credentials, updateCredential],
  );

  return (
    <VaultContext.Provider
      value={{ credentials, loading, error, addCredential, updateCredential, deleteCredential, toggleFavorite, refresh }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
}
