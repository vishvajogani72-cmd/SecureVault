import type { Category } from '@/types';

const colors: Record<Category, string> = {
  Personal: 'bg-accent-500/15 text-accent-300 border-accent-400/30',
  Work: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
  Finance: 'bg-success-500/15 text-success-400 border-success-500/30',
  Social: 'bg-pink-500/15 text-pink-300 border-pink-400/30',
  Entertainment: 'bg-orange-500/15 text-orange-300 border-orange-400/30',
  Developer: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
  Other: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
};

export function Badge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${colors[category]}`}
    >
      {category}
    </span>
  );
}
