import { useMemo, useState } from 'react';
import {
  Search, Plus, KeyRound, Clock, Star, ShieldCheck, TrendingUp, Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CredentialRow } from '@/components/credentials/CredentialRow';
import { CredentialForm } from '@/components/credentials/CredentialForm';
import { useVault } from '@/context/VaultContext';
import { useToast } from '@/components/ui/Toast';
import { useNav } from '@/context/NavContext';
import { CATEGORIES, type Category, type Credential } from '@/types';

export function DashboardPage() {
  const { credentials, loading, addCredential, updateCredential, deleteCredential, toggleFavorite } = useVault();
  const { notify } = useToast();
  const { navigate } = useNav();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);

  const total = credentials.length;
  const favorites = credentials.filter((c) => c.favorite).length;
  const recent = useMemo(
    () => [...credentials].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    [credentials],
  );

  const categoryCounts = useMemo(() => {
    const map = new Map<Category, number>();
    CATEGORIES.forEach((c) => map.set(c, 0));
    credentials.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return map;
  }, [credentials]);

  const filtered = useMemo(() => {
    return credentials.filter((c) => {
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.website.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [credentials, activeCategory, search]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (c: Credential) => { setEditing(c); setFormOpen(true); };

  const handleSubmit = async (data: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) {
      await updateCredential(editing.id, data);
      notify('Credential updated', 'success');
    } else {
      await addCredential(data);
      notify('Credential added to vault', 'success');
    }
  };

  const handleDelete = async (c: Credential) => {
    await deleteCredential(c.id);
    notify('Credential deleted', 'info');
  };

  const stats = [
    { label: 'Saved passwords', value: total, icon: KeyRound, tint: 'text-accent-300' },
    { label: 'Favorites', value: favorites, icon: Star, tint: 'text-warning-400' },
    { label: 'Categories', value: CATEGORIES.length, icon: ShieldCheck, tint: 'text-success-400' },
    { label: 'Recently added', value: recent.length, icon: TrendingUp, tint: 'text-accent-300' },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Overview of your secure vault.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-base-900/60 px-3">
            <Search size={17} className="text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search passwords..."
              className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
          <Button onClick={openAdd}>
            <Plus size={18} /> Add password
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} hover className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white">{s.value}</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-base-800/60">
                  <Icon size={18} className={s.tint} />
                </div>
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Recently added */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Clock size={16} className="text-accent-300" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Recently added</h2>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-base-800/50" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">No credentials yet. Add your first password.</Card>
        ) : (
          <div className="space-y-2.5">
            {recent.map((c) => (
              <CredentialRow
                key={c.id}
                credential={c}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); navigate('passwords'); }}
              className="glass glass-hover flex items-center justify-between rounded-xl px-4 py-3 text-left"
            >
              <span className="text-sm font-medium text-white">{cat}</span>
              <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-xs font-semibold text-accent-300">
                {categoryCounts.get(cat) ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick search result preview when typing */}
      {search && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Filter size={16} className="text-accent-300" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Results for "{search}" ({filtered.length})
            </h2>
          </div>
          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <Card className="p-6 text-center text-sm text-slate-500">No matches found.</Card>
            ) : (
              filtered.map((c) => (
                <CredentialRow
                  key={c.id}
                  credential={c}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </div>
        </div>
      )}

      <CredentialForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
