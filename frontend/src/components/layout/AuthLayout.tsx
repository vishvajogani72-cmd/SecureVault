import type { ReactNode } from 'react';
import { ShieldCheck, Fingerprint, Lock, KeyRound } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: brand / feature panel */}
        <div className="hidden flex-col justify-between lg:flex">
          <Logo size="lg" />
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
                Your passwords,
                <br />
                <span className="text-accent-300">secured by design.</span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
                SecureVault encrypts every credential with zero-knowledge architecture.
                Only you hold the key — not even we can read your vault.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Fingerprint, title: 'Zero-knowledge encryption', desc: 'Your master password never leaves your device.' },
                { icon: Lock, title: 'AES-256 vault', desc: 'Military-grade encryption at rest and in transit.' },
                { icon: KeyRound, title: 'Strong password generator', desc: 'Create unbreakable passwords in one click.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass flex items-start gap-4 rounded-xl px-4 py-3.5">
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg border border-accent-400/30 bg-accent-500/10">
                    <Icon size={18} className="text-accent-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-sm text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck size={14} className="text-success-500" />
            End-to-end encrypted. SOC 2 ready.
          </div>
        </div>

        {/* Right: form panel */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm animate-fade-in-up">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo size="md" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
