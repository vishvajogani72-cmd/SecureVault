import { useState, type FormEvent } from 'react';
import { User, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input, PasswordInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

interface LoginPageProps {
  onGoRegister: () => void;
}

export function LoginPage({ onGoRegister }: LoginPageProps) {
  const { login, loading } = useAuth();
  const { notify } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) return setError('Username is required');
    if (!password) return setError('Master password is required');
    const ok = await login(username.trim(), password);
    if (ok) notify('Vault unlocked. Welcome back.', 'success');
    else setError('Unable to unlock vault. Check your credentials.');
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Enter your master password to unlock your vault.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Username"
          name="username"
          placeholder="alex.morgan"
          autoComplete="username"
          icon={<User size={17} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordInput
          label="Master password"
          name="password"
          placeholder="••••••••••••"
          autoComplete="current-password"
          icon={<Lock size={17} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-sm text-danger-400">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          <ShieldCheck size={18} />
          Unlock vault
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to SecureVault?{' '}
        <button
          onClick={onGoRegister}
          className="font-medium text-accent-300 transition-colors hover:text-accent-200"
        >
          Create an account
        </button>
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-base-900/40 px-3 py-2.5 text-xs text-slate-500">
        <Lock size={13} className="text-success-500" />
        Tip: try any username + password to explore the demo.
      </div>
    </AuthLayout>
  );
}
