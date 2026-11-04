import { useState } from 'react';
import { Eye, EyeOff, Copy, Pencil, Trash2, Star, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import type { Credential } from '@/types';

interface CredentialRowProps {
  credential: Credential;
  onEdit: (c: Credential) => void;
  onDelete: (c: Credential) => void;
  onToggleFavorite: (id: string) => void;
}

function faviconFor(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1bc4f5,0386c4,066a9e&textColor=ffffff&radius=8`;
}

export function CredentialRow({ credential, onEdit, onDelete, onToggleFavorite }: CredentialRowProps) {
  const { notify } = useToast();
  const [revealed, setRevealed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const masked = '•'.repeat(Math.min(credential.password.length, 16));
  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      notify(`${label} copied to clipboard`, 'success');
    } catch {
      notify('Could not copy to clipboard', 'error');
    }
  };

  return (
    <Card hover className="group p-4">
      <div className="flex items-center gap-4">
        <img
          src={faviconFor(credential.website)}
          alt=""
          className="h-11 w-11 flex-shrink-0 rounded-xl border border-white/10 bg-base-800"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">{credential.website}</h3>
            <Badge category={credential.category} />
          </div>
          <p className="truncate text-xs text-slate-400">{credential.username}</p>
        </div>

        <div className="hidden min-w-0 flex-1 sm:block">
          <div className="flex items-center gap-2">
            <code className="truncate font-mono text-sm text-slate-300">
              {revealed ? credential.password : masked}
            </code>
            <button
              onClick={() => setRevealed((r) => !r)}
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:text-accent-300"
              title={revealed ? 'Hide' : 'Show'}
            >
              {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <button
              onClick={() => copy(credential.password, 'Password')}
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:text-accent-300"
              title="Copy password"
            >
              <Copy size={15} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(credential.id)}
            className={`rounded-lg p-2 transition-colors ${
              credential.favorite ? 'text-warning-400' : 'text-slate-600 hover:text-slate-300'
            }`}
            title={credential.favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star size={16} fill={credential.favorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => copy(credential.username, 'Username')}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:text-accent-300"
            title="Copy username"
          >
            <Copy size={15} />
          </button>
          {credential.url && (
            <a
              href={credential.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:text-accent-300"
              title="Open website"
            >
              <ExternalLink size={15} />
            </a>
          )}
          <button
            onClick={() => onEdit(credential)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:text-accent-300"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:text-danger-400"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Mobile password row */}
      <div className="mt-3 flex items-center gap-2 sm:hidden">
        <code className="truncate font-mono text-sm text-slate-300">
          {revealed ? credential.password : masked}
        </code>
        <button onClick={() => setRevealed((r) => !r)} className="rounded-md p-1.5 text-slate-500 hover:text-accent-300">
          {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <button onClick={() => copy(credential.password, 'Password')} className="rounded-md p-1.5 text-slate-500 hover:text-accent-300">
          <Copy size={15} />
        </button>
      </div>

      {credential.notes && (
        <p className="mt-3 truncate text-xs text-slate-500">{credential.notes}</p>
      )}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete credential?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { onDelete(credential); setConfirmDelete(false); }}>
              <Trash2 size={15} /> Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-400">
          This will permanently remove the login for <span className="font-semibold text-white">{credential.website}</span> from your vault. This cannot be undone.
        </p>
      </Modal>
    </Card>
  );
}
