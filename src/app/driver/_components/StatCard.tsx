'use client';

import { LucideIcon } from 'lucide-react';

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'text-white',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
        <Icon size={16} className="text-slate-500" />
      </div>
      <span className={`text-xl sm:text-2xl font-bold tabular-nums truncate ${accent}`}>{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}
