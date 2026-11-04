
import type { Credential, Session } from '@/types';

/**
 * API adapter layer.
 * All backend communication happens through this module.
 */

const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || `Request failed: ${response.status}`
    );
  }

  return data as T;
}


export const api = {
  /** POST /login */
  async login(
    username: string,
    masterPassword: string
  ): Promise<Session> {
    const data = await request<{
      access_token: string;
      token_type: string;
    }>('/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        master_password: masterPassword,
      }),
    });

    const now = new Date().toISOString();

    return {
      user: {
        id: username,
        username,
        createdAt: now,
        lastLoginAt: now,
      },
      token: data.access_token,
    };
  },

  /** POST /register */
  async register(
    username: string,
    masterPassword: string,
    email?: string
  ): Promise<Session> {
    void email;
    await request<{ message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        master_password: masterPassword,
      }),
    });

    return api.login(username, masterPassword);
  },

  /** GET /credentials */
  async listCredentials(token: string): Promise<Credential[]> {
    const data = await request<{
      credentials: {
        id: number;
        website: string;
        username: string;
        password: string;
      }[];
    }>('/credentials', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const now = new Date().toISOString();

    return data.credentials.map((item) => ({
      id: String(item.id),
      website: item.website,
      username: item.username,
      password: item.password,
      category: 'Personal',
      favorite: false,
      createdAt: now,
      updatedAt: now,
    }));
  },

  /** POST /credentials */
  async createCredential(
    token: string,
    input: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Credential> {
    const data = await request<{
      id: number;
      message: string;
    }>('/credentials', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        website: input.website,
        username: input.username,
        password: input.password,
      }),
    });

    const now = new Date().toISOString();

    return {
      ...input,
      id: String(data.id),
      category: input.category,
      favorite: input.favorite ?? false,
      createdAt: now,
      updatedAt: now,
    };
  },

  /** PUT /credentials/:id */
  async updateCredential(
    token: string,
    id: string,
    patch: Partial<Credential>
  ): Promise<Credential> {
    const list = await api.listCredentials(token);
    const current = list.find((item) => item.id === id);

    if (!current) {
      throw new Error('Credential not found');
    }

    const updated = { ...current, ...patch };

    await request<{ message: string }>(`/credentials/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        website: updated.website,
        username: updated.username,
        password: updated.password,
      }),
    });

    return {
      ...updated,
      updatedAt: new Date().toISOString(),
    };
  },

  /** DELETE /credentials/:id */
  async deleteCredential(
    token: string,
    id: string
  ): Promise<void> {
    await request<{ message: string }>(`/credentials/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** POST /change-master-password */
  async changeMasterPassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await request<{ message: string }>('/change-master-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  },


  /** POST /logout */
  async logout(token: string): Promise<void> {
    await request<{ message: string }>('/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  baseUrl: BASE_URL,
} satisfies {
  login: (
    username: string,
    masterPassword: string
  ) => Promise<Session>;

  register: (
    username: string,
    masterPassword: string,
    email?: string
  ) => Promise<Session>;

  listCredentials: (token: string) => Promise<Credential[]>;

  createCredential: (
    token: string,
    input: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Credential>;

  updateCredential: (
    token: string,
    id: string,
    patch: Partial<Credential>
  ) => Promise<Credential>;

  deleteCredential: (
    token: string,
    id: string
  ) => Promise<void>;

  changeMasterPassword: (
    token: string,
    oldPassword: string,
    newPassword: string
  ) => Promise<void>;


  logout: (token: string) => Promise<void>;

  baseUrl: string;
};

export type Api = typeof api;
