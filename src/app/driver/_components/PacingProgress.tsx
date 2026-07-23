'use client';

import { PacingResult } from '../_lib/calculations';
import { formatCurrencyCompact } from '../_lib/format';

const STATUS_LABEL: Record<PacingResult['status'], string> = {
  ahead: 'Ahead of Pace',
  'on-track': 'On Track',
  behind: 'Behind Target',
};

const STATUS_COLOR: Record<PacingResult['status'], string> = {
  ahead: 'bg-emerald-500 text-emerald-950',
  'on-track': 'bg-amber-400 text-amber-950',
  behind: 'bg-red-500 text-red-950',
};

const BAR_COLOR: Record<PacingResult['status'], string> = {
  ahead: 'bg-emerald-500',
  'on-track': 'bg-amber-400',
  behind: 'bg-red-500',
};

export default function PacingProgress({ result, title }: { result: PacingResult; title: string }) {
  const barPct = Math.min(result.progressPct, 100);

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[result.status]}`}>
          {STATUS_LABEL[result.status]}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {formatCurrencyCompact(result.earned)}
        </span>
        <span className="text-slate-400 text-sm pb-1">of {formatCurrencyCompact(result.goal)}</span>
      </div>

      <div className="mt-3 h-3 w-full rounded-full bg-slate-900 relative overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${BAR_COLOR[result.status]}`}
          style={{ width: `${barPct}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-white/50"
          style={{ left: `${Math.min(result.expectedPct, 100)}%` }}
          title="Expected pace today"
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>
          Day {result.daysElapsed} of {result.daysTotal}
        </span>
        <span>{result.progressPct.toFixed(0)}% of goal</span>
      </div>
    </div>
  );
}
