import { useState, type FormEvent } from 'react';
import { User, Lock, Mail, UserPlus, ArrowRight, Check, X } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input, PasswordInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StrengthMeter } from '@/components/ui/StrengthMeter';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { evaluateStrength } from '@/lib/crypto';

interface RegisterPageProps {
  onGoLogin: () => void;
}

const requirements = [
  { label: 'At least 12 characters', test: (p: string) => p.length >= 12 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

export function RegisterPage({ onGoLogin }: RegisterPageProps) {
  const { register, loading } = useAuth();
  const { notify } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const strength = evaluateStrength(password);
  const passMismatch = confirm.length > 0 && confirm !== password;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) return setError('Choose a username');
    if (strength.score < 2) return setError('Choose a stronger master password');
    if (confirm !== password) return setError('Passwords do not match');
    const ok = await register(username.trim(), password, email.trim() || undefined);
    if (ok) notify('Account created. Your vault is ready.', 'success');
    else setError('Could not create account. Try again.');
  };

  return (
    <AuthLayout>
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-white">Create your vault</h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Your master password encrypts everything. We can't recover it if lost.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Username"
          name="username"
          placeholder="alex.morgan"
          autoComplete="username"
          icon={<User size={17} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Email (optional)"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail size={17} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Master password"
          name="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          icon={<Lock size={17} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && (
          <div className="space-y-3">
            <StrengthMeter password={password} />
            <div className="grid grid-cols-1 gap-1.5">
              {requirements.map((r) => {
                const met = r.test(password);
                return (
                  <div key={r.label} className="flex items-center gap-2 text-xs">
                    {met ? (
                      <Check size={13} className="text-success-400" />
                    ) : (
                      <X size={13} className="text-slate-600" />
                    )}
                    <span className={met ? 'text-slate-300' : 'text-slate-500'}>{r.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <PasswordInput
          label="Confirm master password"
          name="confirm"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          icon={<Lock size={17} />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={passMismatch ? 'Passwords do not match' : undefined}
        />

        {error && (
          <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-sm text-danger-400">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
          <UserPlus size={18} />
          Create vault
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have a vault?{' '}
        <button
          onClick={onGoLogin}
          className="font-medium text-accent-300 transition-colors hover:text-accent-200"
        >
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
