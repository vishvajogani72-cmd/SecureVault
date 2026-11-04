import { ShieldCheck } from 'lucide-react';

export function Logo({ size = 'md', withText = true }: { size?: 'sm' | 'md' | 'lg'; withText?: boolean }) {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 34 : 28;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid place-items-center">
        <div className="absolute inset-0 rounded-xl bg-accent-400/20 blur-md" />
        <div className="relative grid h-11 w-11 place-items-center rounded-xl border border-accent-400/40 bg-gradient-to-br from-accent-500/30 to-accent-700/10">
          <ShieldCheck size={iconSize} className="text-accent-300" />
        </div>
      </div>
      {withText && (
        <span className={`font-bold tracking-tight ${textSize}`}>
          <span className="text-white">Secure</span>
          <span className="text-accent-300">Vault</span>
        </span>
      )}
    </div>
  );
}
