import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { StrengthMeter } from '@/components/ui/StrengthMeter';
import { useToast } from '@/components/ui/Toast';
import { generatePassword } from '@/lib/crypto';
import type { GenerateOptions } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function GeneratorPage() {
  const { notify } = useToast();
  const { clipboardClearEnabled } = useAuth();

  const clipboardTimer = useRef<number | null>(null);

  const [options, setOptions] = useState<GenerateOptions>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });

  const [password, setPassword] = useState(() => generatePassword(options));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (clipboardTimer.current !== null) {
        window.clearTimeout(clipboardTimer.current);
      }
    };
  }, []);

  const regenerate = useCallback((opts: GenerateOptions) => {
    setPassword(generatePassword(opts));
    setCopied(false);
  }, []);

  const update = <K extends keyof GenerateOptions>(
    key: K,
    value: GenerateOptions[K],
  ) => {
    const next = { ...options, [key]: value };

    if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) {
      next.lowercase = true;
    }

    setOptions(next);
    regenerate(next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);

      if (clipboardTimer.current !== null) {
        window.clearTimeout(clipboardTimer.current);
        clipboardTimer.current = null;
      }

      if (!clipboardClearEnabled) {
        notify('Password copied to clipboard.', 'success');
        return;
      }

      notify('Password copied. Clipboard will clear in 30 seconds.', 'success');

      const copiedPassword = password;

      clipboardTimer.current = window.setTimeout(async () => {
        try {
          const currentClipboard = await navigator.clipboard.readText();

          if (currentClipboard === copiedPassword) {
            await navigator.clipboard.writeText('');
          }
        } catch {
          console.warn('Automatic clipboard clearing was blocked by the browser.');
        }

        setCopied(false);
        clipboardTimer.current = null;
      }, 30_000);
    } catch {
      notify('Could not copy password. Check clipboard permissions.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent-400" />
          <h1 className="text-2xl font-bold text-white">Password Generator</h1>
        </div>
        <p className="text-sm text-slate-400">
          Create strong and secure passwords for your accounts.
        </p>
      </div>

      <Card className="space-y-6 p-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-300">
            Generated Password
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex min-h-14 flex-1 items-center break-all rounded-xl border border-white/10 bg-base-900/70 px-4 py-3 font-mono text-lg text-accent-200">
              {password}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => regenerate(options)}>
                <RefreshCw size={17} />
                Generate
              </Button>

              <Button onClick={copy}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>

        <StrengthMeter password={password} />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="password-length" className="text-sm font-medium text-slate-300">
              Password Length
            </label>
            <span className="rounded-lg bg-accent-500/10 px-3 py-1 text-sm font-semibold text-accent-300">
              {options.length} characters
            </span>
          </div>

          <input
            id="password-length"
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(event) => update('length', Number(event.target.value))}
            className="w-full accent-cyan-400"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">
            Character Settings
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Toggle
              label="Uppercase Letters (A-Z)"
              checked={options.uppercase}
              onChange={(value) => update('uppercase', value)}
            />
            <Toggle
              label="Lowercase Letters (a-z)"
              checked={options.lowercase}
              onChange={(value) => update('lowercase', value)}
            />
            <Toggle
              label="Numbers (0-9)"
              checked={options.numbers}
              onChange={(value) => update('numbers', value)}
            />
            <Toggle
              label="Symbols (!@#$)"
              checked={options.symbols}
              onChange={(value) => update('symbols', value)}
            />
            <Toggle
              label="Exclude Ambiguous Characters"
              description="Avoid characters like O, 0, l and 1"
              checked={options.excludeAmbiguous}
              onChange={(value) => update('excludeAmbiguous', value)}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-accent-400/20 bg-accent-400/5 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-400" />
          <p className="text-xs leading-relaxed text-slate-400">
            Your password is generated locally in your browser. Never share your
            master password with anyone.
          </p>
        </div>
      </Card>
    </div>
  );
}
