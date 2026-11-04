import { evaluateStrength } from '@/lib/crypto';

const barColors = ['bg-danger-500', 'bg-warning-500', 'bg-warning-400', 'bg-accent-400', 'bg-success-500'];
const textColors = ['text-danger-400', 'text-warning-400', 'text-warning-400', 'text-accent-300', 'text-success-400'];

export function StrengthMeter({ password }: { password: string }) {
  const { score, label } = evaluateStrength(password);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Strength</span>
        <span className={`text-xs font-semibold ${textColors[score]}`}>{label}</span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= score ? barColors[score] : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
