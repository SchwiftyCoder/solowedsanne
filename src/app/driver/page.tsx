'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CircleDollarSign, FileText, HelpCircle, Play, Plus, Route, Square, Timer, Wallet } from 'lucide-react';
import { loadActiveShift, loadFixedExpenses, loadSettings, loadShifts, saveActiveShift, saveFixedExpenses, saveSettings, saveShifts } from './_lib/storage';
import { ActiveShift, DEFAULT_SETTINGS, FixedExpense, Settings, Shift } from './_lib/types';
import { computePacing, mileageDeduction, shiftVariableExpenseTotal, summarizeShifts } from './_lib/calculations';
import { createEmptyShift } from './_lib/shifts';
import { toDateKey } from './_lib/dates';
import { formatCurrency, formatHoursHM, formatMiles } from './_lib/format';

import DeficitBanner from './_components/DeficitBanner';
import PacingProgress from './_components/PacingProgress';
import StatCard from './_components/StatCard';
import EarningsChart from './_components/EarningsChart';
import ShiftTable from './_components/ShiftTable';
import ShiftEditor from './_components/ShiftEditor';
import FixedExpensesPanel from './_components/FixedExpensesPanel';
import SettingsPanel from './_components/SettingsPanel';
import { StartShiftModal, EndShiftModal, ShiftPlatform } from './_components/QuickShiftModal';
import ReportModal from './_components/ReportModal';
import InfoTip from './_components/InfoTip';

export default function DriverDashboard() {
  const [hydrated, setHydrated] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [activeShift, setActiveShift] = useState<ActiveShift | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month' | null>(null);

  useEffect(() => {
    // one-time hydration from localStorage; must run client-side after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShifts(loadShifts());
    setFixedExpenses(loadFixedExpenses());
    setSettings(loadSettings());
    setActiveShift(loadActiveShift());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveShifts(shifts);
  }, [shifts, hydrated]);

  useEffect(() => {
    if (hydrated) saveFixedExpenses(fixedExpenses);
  }, [fixedExpenses, hydrated]);

  useEffect(() => {
    if (hydrated) saveSettings(settings);
  }, [settings, hydrated]);

  const today = useMemo(() => new Date(), []);

  const weekly = useMemo(
    () => computePacing('week', today, shifts, fixedExpenses, settings.weeklyGoal, settings.weekStartsOn),
    [today, shifts, fixedExpenses, settings]
  );
  const monthly = useMemo(
    () => computePacing('month', today, shifts, fixedExpenses, settings.monthlyGoal, settings.weekStartsOn),
    [today, shifts, fixedExpenses, settings]
  );

  const monthSummary = useMemo(
    () => summarizeShifts(monthly.shifts, fixedExpenses, monthly.daysTotal),
    [monthly, fixedExpenses]
  );
  const taxDeduction = mileageDeduction(monthSummary.miles, settings);
  const monthVariableExpenses = monthly.shifts.reduce((s, sh) => s + shiftVariableExpenseTotal(sh), 0);

  function handleSaveShift(shift: Shift) {
    setShifts((prev) => {
      const exists = prev.some((s) => s.id === shift.id);
      return exists ? prev.map((s) => (s.id === shift.id ? shift : s)) : [...prev, shift];
    });
    setEditingShift(null);
  }

  function handleDeleteShift(id: string) {
    setShifts((prev) => prev.filter((s) => s.id !== id));
    setEditingShift(null);
  }

  function addManualShift() {
    const key = toDateKey(new Date());
    const existing = shifts.find((s) => s.date === key);
    setEditingShift(existing ?? createEmptyShift(key));
  }

  function startShift(startOdometer: number | null) {
    const active: ActiveShift = { startedAt: Date.now(), startOdometer };
    setActiveShift(active);
    saveActiveShift(active);
    setShowStartModal(false);
  }

  function endShift(data: { hours: number; miles: number | null; fuel: number; misc: number; platform: ShiftPlatform }) {
    const dateKey = toDateKey(new Date());
    const uberHours = data.platform === 'uber' ? data.hours : data.platform === 'both' ? data.hours / 2 : 0;
    const lyftHours = data.platform === 'lyft' ? data.hours : data.platform === 'both' ? data.hours / 2 : 0;
    setShifts((prev) => {
      const existing = prev.find((s) => s.date === dateKey);
      if (existing) {
        return prev.map((s) =>
          s.id === existing.id
            ? {
                ...s,
                hours: s.hours + data.hours,
                uber: { ...s.uber, hours: s.uber.hours + uberHours },
                lyft: { ...s.lyft, hours: s.lyft.hours + lyftHours },
                odometerMiles: data.miles != null ? (s.odometerMiles ?? 0) + data.miles : s.odometerMiles,
                expenses: {
                  ...s.expenses,
                  gas: s.expenses.gas + data.fuel,
                  other: s.expenses.other + data.misc,
                },
              }
            : s
        );
      }
      const fresh = createEmptyShift(dateKey);
      return [
        {
          ...fresh,
          hours: data.hours,
          uber: { ...fresh.uber, hours: uberHours },
          lyft: { ...fresh.lyft, hours: lyftHours },
          odometerMiles: data.miles,
          expenses: { ...fresh.expenses, gas: data.fuel, other: data.misc },
        },
        ...prev,
      ];
    });
    setActiveShift(null);
    saveActiveShift(null);
    setShowEndModal(false);
  }

  function discardShift() {
    setActiveShift(null);
    saveActiveShift(null);
    setShowEndModal(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      <header className="border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-lg font-bold text-white">Driver Earnings</h1>
              <p className="text-xs text-slate-500">Uber & Lyft pacing tracker</p>
            </div>
            <Link href="/driver/help" title="Help & guide" className="text-slate-500 hover:text-sky-400 p-1">
              <HelpCircle size={18} />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {activeShift ? (
              <button
                onClick={() => setShowEndModal(true)}
                className="flex items-center gap-1.5 text-sm bg-red-500 text-red-950 font-medium px-3 py-2 rounded-lg hover:bg-red-400"
              >
                <Square size={14} /> End shift
              </button>
            ) : (
              <button
                onClick={() => setShowStartModal(true)}
                className="flex items-center gap-1.5 text-sm bg-emerald-500 text-emerald-950 font-medium px-3 py-2 rounded-lg hover:bg-emerald-400"
              >
                <Play size={14} /> Start shift
              </button>
            )}
            <button
              onClick={addManualShift}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              <Plus size={16} /> Log day
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {activeShift && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 flex items-center gap-3 text-sm">
            <Timer size={16} className="text-emerald-400 shrink-0" />
            <span className="text-emerald-200">
              Shift in progress since{' '}
              {new Date(activeShift.startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              {activeShift.startOdometer != null && ` · odo ${activeShift.startOdometer.toLocaleString()}`}
            </span>
          </div>
        )}

        <DeficitBanner weekly={weekly} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PacingProgress
            result={weekly}
            title="This week"
            tip="Net income earned this week vs your weekly goal. The thin white tick shows where you should be today to stay on pace. Green = ahead, amber = on track, red = behind."
          />
          <PacingProgress
            result={monthly}
            title="This month"
            tip="Net income earned this calendar month vs your monthly goal. The thin white tick shows where you should be today to stay on pace."
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Gross (month)"
            value={formatCurrency(monthSummary.gross)}
            icon={CircleDollarSign}
            tip="Everything Uber and Lyft paid you this month — fares, tips, and bonuses combined — before any expenses come out."
          />
          <StatCard
            label="Net (month)"
            value={formatCurrency(monthSummary.netIncome)}
            sub={`- ${formatCurrency(monthVariableExpenses + monthSummary.proratedFixedExpenses)} expenses`}
            icon={Wallet}
            accent={monthSummary.netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}
            tip="What you actually keep: gross minus day-to-day expenses (gas, washes, meals) minus your recurring overhead prorated for the month so far."
          />
          <StatCard
            label="True net hourly"
            value={monthSummary.hours > 0 ? `${formatCurrency(monthSummary.netHourlyRate)}/hr` : '—'}
            sub={`${formatHoursHM(monthSummary.hours)} logged`}
            icon={Timer}
            accent="text-sky-400"
            tip="Net income divided by hours logged — your real wage after expenses, not the gross rate the apps show you."
          />
          <StatCard
            label="$ / mile yield"
            value={monthSummary.miles > 0 ? `${formatCurrency(monthSummary.gross / monthSummary.miles)}/mi` : '—'}
            sub={`${formatMiles(monthSummary.miles)} · IRS offset ${formatCurrency(taxDeduction)}`}
            icon={Route}
            accent="text-sky-400"
            tip="Gross earned per mile driven — higher is better for your car's wear. IRS offset is your estimated mileage tax deduction (miles × rate in Settings). It reduces taxable income; it isn't cash."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-300 mr-1 flex items-center gap-1.5">
            <FileText size={15} /> Statements
            <InfoTip text="Generates a printable summary of the current week or month — earnings by platform, expense audit, tax offset, and per-day details. Tap Print / Save PDF inside to export it." />
          </span>
          <button
            onClick={() => setReportPeriod('week')}
            className="text-sm px-3 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            Weekly PDF
          </button>
          <button
            onClick={() => setReportPeriod('month')}
            className="text-sm px-3 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            Monthly PDF
          </button>
        </div>

        <EarningsChart shifts={shifts} />

        <div>
          <h2 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            Daily log
            <InfoTip text="One row per day you worked. Tap the pencil to edit a day's earnings, hours, miles, or expenses; the trash icon deletes it. Ending a shift adds to the same day's row." />
          </h2>
          <ShiftTable shifts={shifts} onEdit={setEditingShift} onDelete={handleDeleteShift} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FixedExpensesPanel expenses={fixedExpenses} onChange={setFixedExpenses} />
          <SettingsPanel settings={settings} onChange={setSettings} />
        </div>
      </main>

      {editingShift && (
        <ShiftEditor shift={editingShift} onSave={handleSaveShift} onDelete={handleDeleteShift} onClose={() => setEditingShift(null)} />
      )}
      {showStartModal && <StartShiftModal onStart={startShift} onClose={() => setShowStartModal(false)} />}
      {showEndModal && activeShift && (
        <EndShiftModal active={activeShift} onEnd={endShift} onDiscard={discardShift} onClose={() => setShowEndModal(false)} />
      )}
      {reportPeriod && (
        <ReportModal
          pacing={reportPeriod === 'week' ? weekly : monthly}
          fixedExpenses={fixedExpenses}
          settings={settings}
          onClose={() => setReportPeriod(null)}
        />
      )}
    </div>
  );
}
