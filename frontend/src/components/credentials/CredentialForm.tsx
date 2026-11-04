import { useState, type FormEvent } from 'react';
import { Globe, User, Lock, Plus, RefreshCw } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input, PasswordInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StrengthMeter } from '@/components/ui/StrengthMeter';
import { generatePassword } from '@/lib/crypto';
import { CATEGORIES, type Category, type Credential } from '@/types';

interface CredentialFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initial?: Credential | null;
}

export function CredentialForm({ open, onClose, onSubmit, initial }: CredentialFormProps) {
  const [website, setWebsite] = useState(initial?.website ?? '');
  const [url, setUrl] = useState(initial?.url ?? '');
  const [username, setUsername] = useState(initial?.username ?? '');
  const [password, setPassword] = useState(initial?.password ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'Personal');
  const [favorite, setFavorite] = useState(initial?.favorite ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial;

  const reset = () => {
    setWebsite(''); setUrl(''); setUsername(''); setPassword(''); setNotes('');
    setCategory('Personal'); setFavorite(false); setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleGenerate = () => {
    setPassword(generatePassword({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!website.trim()) return setError('Website name is required');
    if (!username.trim()) return setError('Username is required');
    if (!password) return setError('Password is required');
    setSaving(true);
    try {
      await onSubmit({
        website: website.trim(),
        url: url.trim() || undefined,
        username: username.trim(),
        password,
        notes: notes.trim() || undefined,
        category,
        favorite,
      });
      handleClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit credential' : 'Add credential'}
      description={isEdit ? 'Update this saved login.' : 'Save a new login to your vault.'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={submit} loading={saving}>
            <Plus size={16} /> {isEdit ? 'Save changes' : 'Add to vault'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Website"
            placeholder="GitHub"
            icon={<Globe size={17} />}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="h-11 w-full rounded-xl border border-white/10 bg-base-900/60 px-3.5 text-sm text-white focus:border-accent-400/60 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-base-900">
                {c}
              </option>
            ))}
          </select>
          </div>
        </div>
        <Input
          label="URL (optional)"
          placeholder="https://github.com"
          icon={<Globe size={17} />}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          label="Username"
          placeholder="alex.morgan"
          icon={<User size={17} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div>
          <PasswordInput
            label="Password"
            placeholder="Enter or generate a password"
            icon={<Lock size={17} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            extraTrailing={
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:text-accent-300"
                title="Generate strong password"
              >
                <RefreshCw size={15} />
              </button>
            }
          />
          {password && <div className="mt-2"><StrengthMeter password={password} /></div>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="2FA enabled, recovery codes, etc."
            className="w-full rounded-xl border border-white/10 bg-base-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-accent-400/60 focus:outline-none"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-base-800 accent-accent-500"
          />
          Mark as favorite
        </label>
        {error && (
          <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-sm text-danger-400">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}
