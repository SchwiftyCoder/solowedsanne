'use client';

import { AlertTriangle } from 'lucide-react';
import { PacingResult } from '../_lib/calculations';
import { formatCurrency, formatHours } from '../_lib/format';
import InfoTip from './InfoTip';

export default function DeficitBanner({ weekly }: { weekly: PacingResult }) {
  if (weekly.status !== 'behind' || weekly.shortfall <= 0) return null;

  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 sm:p-5 flex gap-3 sm:gap-4">
      <AlertTriangle className="shrink-0 text-red-400" size={22} />
      <div className="min-w-0">
        <p className="font-semibold text-red-300 text-sm sm:text-base flex items-center gap-1.5">
          Behind pace for this week
          <InfoTip text="Shows when your net income so far is below where it should be to hit your weekly goal. Shortfall is what's left to earn. Needed/day spreads that across the remaining days. Hours needed uses your recent net hourly rate." />
        </p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
          <div>
            <p className="text-red-200/70 text-xs uppercase tracking-wide">Shortfall</p>
            <p className="text-red-100 font-semibold text-base">{formatCurrency(weekly.shortfall)}</p>
          </div>
          <div>
            <p className="text-red-200/70 text-xs uppercase tracking-wide">
              Needed / day ({weekly.daysRemaining} left)
            </p>
            <p className="text-red-100 font-semibold text-base">
              {weekly.daysRemaining > 0 ? formatCurrency(weekly.requiredDailyIncome) : '—'}
            </p>
          </div>
          <div>
            <p className="text-red-200/70 text-xs uppercase tracking-wide">Hours needed</p>
            <p className="text-red-100 font-semibold text-base">
              {weekly.requiredHours != null ? formatHours(weekly.requiredHours) : 'Log hours to estimate'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
