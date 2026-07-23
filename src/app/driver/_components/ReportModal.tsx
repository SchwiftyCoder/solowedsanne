'use client';

import { X, Printer } from 'lucide-react';
import { PacingResult, summarizeShifts, mileageDeduction, shiftGross, shiftMiles, shiftVariableExpenseTotal } from '../_lib/calculations';
import { FixedExpense, Settings } from '../_lib/types';
import { formatCurrency, formatHours, formatMiles } from '../_lib/format';
import { formatShortDate, formatWeekdayShort } from '../_lib/dates';

export default function ReportModal({
  pacing,
  fixedExpenses,
  settings,
  onClose,
}: {
  pacing: PacingResult;
  fixedExpenses: FixedExpense[];
  settings: Settings;
  onClose: () => void;
}) {
  const summary = summarizeShifts(pacing.shifts, fixedExpenses, pacing.daysTotal);
  const taxOffset = mileageDeduction(summary.miles, settings);
  const rangeLabel = `${pacing.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${pacing.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const title = pacing.periodLabel === 'week' ? 'Weekly Statement' : 'Monthly Statement';
  const sorted = pacing.shifts.slice().sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto print:overflow-visible print:bg-white" id="driver-report-overlay">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #driver-report-overlay, #driver-report-overlay * { visibility: visible; }
          #driver-report-overlay { position: absolute; inset: 0; padding: 0 !important; }
          #driver-report-sheet { box-shadow: none !important; border: none !important; border-radius: 0 !important; margin: 0 !important; max-width: none !important; }
          .print-hide { display: none !important; }
          #driver-report-sheet { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="min-h-full flex items-start justify-center p-0 sm:p-6">
        <div id="driver-report-sheet" className="w-full max-w-2xl bg-slate-900 border border-slate-700 sm:rounded-2xl text-slate-100 my-0 sm:my-4">
          <div className="print-hide flex items-center justify-between px-5 pt-4">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm bg-sky-500 text-sky-950 font-medium px-3 py-2 rounded-lg hover:bg-sky-400"
            >
              <Printer size={16} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-white p-2">
              <X size={20} />
            </button>
          </div>

          <div className="px-5 sm:px-8 py-6">
            <div className="flex items-baseline justify-between flex-wrap gap-2 border-b border-slate-700 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <p className="text-sm text-slate-400">{rangeLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500">Net income</p>
                <p className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(summary.netIncome)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-700">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Gross revenue</p>
                <p className="text-base font-semibold text-white">{formatCurrency(summary.gross)}</p>
                <p className="text-xs text-slate-500">
                  Uber {formatCurrency(summary.uberGross)} · Lyft {formatCurrency(summary.lyftGross)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Hours / net rate</p>
                <p className="text-base font-semibold text-sky-400">
                  {summary.hours > 0 ? `${formatCurrency(summary.netHourlyRate)}/hr` : '—'}
                </p>
                <p className="text-xs text-slate-500">{formatHours(summary.hours)} logged</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Miles / yield</p>
                <p className="text-base font-semibold text-sky-400">
                  {summary.miles > 0 ? `${formatCurrency(summary.gross / summary.miles)}/mi` : '—'}
                </p>
                <p className="text-xs text-slate-500">{formatMiles(summary.miles)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Tax mileage offset</p>
                <p className="text-base font-semibold text-emerald-400">{formatCurrency(taxOffset)}</p>
                <p className="text-xs text-slate-500">@ {formatCurrency(settings.mileageRate)}/mi</p>
              </div>
            </div>

            <div className="py-4 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-300 mb-2">Expense audit</h2>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Variable expenses (gas, wash, meals, misc)</span>
                  <span className="text-slate-200">{formatCurrency(summary.variableExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Fixed overhead prorated ({pacing.daysTotal} days)
                  </span>
                  <span className="text-slate-200">{formatCurrency(summary.proratedFixedExpenses)}</span>
                </div>
                {fixedExpenses.filter((e) => e.amount > 0).map((e) => (
                  <div key={e.id} className="flex justify-between pl-4 text-xs">
                    <span className="text-slate-500">{e.name}</span>
                    <span className="text-slate-500">
                      {formatCurrency(e.amount)}/{e.cadence === 'monthly' ? 'mo' : 'wk'}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-slate-800 font-semibold">
                  <span className="text-slate-300">Total expenses</span>
                  <span className="text-red-400">
                    {formatCurrency(summary.variableExpenses + summary.proratedFixedExpenses)}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-4">
              <h2 className="text-sm font-semibold text-slate-300 mb-2">Shift details</h2>
              {sorted.length === 0 ? (
                <p className="text-sm text-slate-500">No shifts recorded in this period.</p>
              ) : (
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 uppercase tracking-wide border-b border-slate-700">
                      <th className="py-2 font-medium">Date</th>
                      <th className="py-2 font-medium text-right">Uber</th>
                      <th className="py-2 font-medium text-right">Lyft</th>
                      <th className="py-2 font-medium text-right">Expenses</th>
                      <th className="py-2 font-medium text-right">Miles</th>
                      <th className="py-2 font-medium text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {sorted.map((s) => (
                      <tr key={s.id}>
                        <td className="py-2 text-slate-300 whitespace-nowrap">
                          {formatWeekdayShort(s.date)} {formatShortDate(s.date)}
                        </td>
                        <td className="py-2 text-right text-slate-300">{formatCurrency(s.uber.fare + s.uber.tips + s.uber.bonus)}</td>
                        <td className="py-2 text-right text-slate-300">{formatCurrency(s.lyft.fare + s.lyft.tips + s.lyft.bonus)}</td>
                        <td className="py-2 text-right text-slate-400">{formatCurrency(shiftVariableExpenseTotal(s))}</td>
                        <td className="py-2 text-right text-slate-400">{formatMiles(shiftMiles(s))}</td>
                        <td className="py-2 text-right font-medium text-emerald-400">
                          {formatCurrency(shiftGross(s) - shiftVariableExpenseTotal(s))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <p className="text-[10px] text-slate-600 pt-2">
              Generated {new Date().toLocaleString()} · Driver Earnings · Net = gross − variable expenses − prorated fixed overhead.
              Mileage offset is an estimated IRS deduction, not income.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
