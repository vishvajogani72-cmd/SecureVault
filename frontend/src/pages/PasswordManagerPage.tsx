import { useMemo, useState } from 'react';
import { Search, Plus, KeyRound, Filter, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CredentialRow } from '@/components/credentials/CredentialRow';
import { CredentialForm } from '@/components/credentials/CredentialForm';
import { useVault } from '@/context/VaultContext';
import { useToast } from '@/components/ui/Toast';
import { CATEGORIES, type Category, type Credential } from '@/types';

export function PasswordManagerPage() {
  const { credentials, loading, addCredential, updateCredential, deleteCredential, toggleFavorite } = useVault();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);

  const filtered = useMemo(() => {
    return credentials.filter((c) => {
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.website.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        (c.url ?? '').toLowerCase().includes(q);
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

  const filterChips: (Category | 'All')[] = ['All', ...CATEGORIES];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vault</h1>
          <p className="mt-1 text-sm text-slate-400">
            {credentials.length} credential{credentials.length !== 1 ? 's' : ''} stored securely.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={18} /> Add password
        </Button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by website, username or URL…"
            icon={<Search size={17} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            trailing={
              search ? (
                <button onClick={() => setSearch('')} className="rounded-md p-2 text-slate-500 hover:text-white">
                  <X size={15} />
                </button>
              ) : undefined
            }
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter size={14} /> {filtered.length} shown
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {filterChips.map((chip) => {
          const active = activeCategory === chip;
          return (
            <button
              key={chip}
              onClick={() => setActiveCategory(chip)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                active
                  ? 'border-accent-400/50 bg-accent-500/15 text-accent-200'
                  : 'border-white/10 bg-base-800/40 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-base-800/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-base-800/60">
            <KeyRound size={24} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">No credentials found</p>
            <p className="mt-1 text-xs text-slate-500">
              {search || activeCategory !== 'All'
                ? 'Try a different search or filter.'
                : 'Add your first password to get started.'}
            </p>
          </div>
          <Button variant="secondary" onClick={openAdd}>
            <Plus size={16} /> Add password
          </Button>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((c) => (
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

      <CredentialForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
