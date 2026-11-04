import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // clipboard may be blocked; still show feedback
      setCopied(true);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-base-800/60 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-accent-400/40 hover:text-accent-200"
    >
      {copied ? <Check size={13} className="text-success-400" /> : <Copy size={13} />}
      {copied ? 'Copied' : label}
    </button>
  );
}
